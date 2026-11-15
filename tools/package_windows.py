"""Build the distributable Syllo Windows app, portable ZIP and user installer."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import zipfile


ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
BUILD = ROOT / ".dev" / "package"
STAGING = BUILD / "Syllo"
OUTPUT = ROOT / "Syllo"
RUNTIME = ROOT / ".dev" / "electron" / "runtime"
RCEDIT = ROOT / ".dev" / "build-tools" / "rcedit-x64.exe"
MAKENSIS = ROOT / ".dev" / "build-tools" / "nsis-3.11" / "nsis-3.11" / "makensis.exe"
ICON = ROOT / "assets" / "syllo.ico"


def run(*args):
    subprocess.run([str(arg) for arg in args], check=True)


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def copy_application():
    shutil.copytree(RUNTIME, STAGING)
    electron = STAGING / "electron.exe"
    electron.replace(STAGING / "Syllo.exe")

    application = STAGING / "resources" / "app"
    application.mkdir(parents=True, exist_ok=True)
    for name in ("package.json", "identity.js", "visuals.js", "theme.js", "semesters.js", "board.js", "README.md"):
        shutil.copy2(ROOT / name, application / name)
    for name in ("desktop", "assets"):
        shutil.copytree(ROOT / name, application / name, dirs_exist_ok=True)

    guide = (ROOT / "docs" / "USER-GUIDE.md").read_text(encoding="utf-8")
    (STAGING / "使用说明.txt").write_text(guide, encoding="utf-8-sig")


def set_executable_identity():
    run(
        RCEDIT,
        STAGING / "Syllo.exe",
        "--set-icon",
        ICON,
        "--set-file-version",
        f"{VERSION}.0",
        "--set-product-version",
        f"{VERSION}.0",
        "--set-version-string",
        "FileDescription",
        "Syllo",
        "--set-version-string",
        "ProductName",
        "Syllo",
        "--set-version-string",
        "OriginalFilename",
        "Syllo.exe",
        "--set-version-string",
        "InternalName",
        "Syllo",
    )


def write_manifest():
    text = (
        f"Syllo {VERSION}\n"
        "Platform: Windows 10/11 x64\n"
        f"Electron: {(ROOT / '.dev' / 'electron' / 'version.txt').read_text().strip()}\n"
        "The whole application folder must stay together.\n"
    )
    (STAGING / "版本信息.txt").write_text(text, encoding="utf-8-sig")


def make_portable_zip():
    archive = OUTPUT / f"Syllo-Windows-x64-v{VERSION}.zip"
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for path in sorted(STAGING.rglob("*")):
            if path.is_file():
                bundle.write(path, Path(STAGING.name) / path.relative_to(STAGING))
    return archive


def make_installer():
    installer = OUTPUT / f"Syllo-Setup-v{VERSION}.exe"
    script = BUILD / "installer.nsi"
    script.write_text(
        f'''Unicode true
SetCompressor /SOLID lzma
SetCompressorDictSize 64
Name "Syllo"
BrandingText "Syllo"
Caption "Syllo 安装程序"
OutFile "{installer.as_posix()}"
InstallDir "$LOCALAPPDATA\\Programs\\Syllo"
InstallDirRegKey HKCU "Software\\Syllo" "InstallDir"
RequestExecutionLevel user
Icon "{ICON.as_posix()}"
UninstallIcon "{ICON.as_posix()}"
VIProductVersion "{VERSION}.0"
VIAddVersionKey "ProductName" "Syllo"
VIAddVersionKey "FileDescription" "Syllo Windows installer"
VIAddVersionKey "FileVersion" "{VERSION}"
VIAddVersionKey "ProductVersion" "{VERSION}"

!include "MUI2.nsh"
!define MUI_ABORTWARNING
!define MUI_ICON "{ICON.as_posix()}"
!define MUI_UNICON "{ICON.as_posix()}"
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\\Syllo.exe"
!define MUI_FINISHPAGE_RUN_TEXT "启动 Syllo"
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "SimpChinese"
!insertmacro MUI_LANGUAGE "English"

Section "Syllo" SEC_MAIN
  SetShellVarContext current
  SetOutPath "$INSTDIR"
  File /r "{STAGING.as_posix()}\\*.*"
  WriteUninstaller "$INSTDIR\\Uninstall.exe"
  CreateDirectory "$SMPROGRAMS\\Syllo"
  CreateShortcut "$SMPROGRAMS\\Syllo\\Syllo.lnk" "$INSTDIR\\Syllo.exe" "" "$INSTDIR\\Syllo.exe" 0
  CreateShortcut "$DESKTOP\\Syllo.lnk" "$INSTDIR\\Syllo.exe" "" "$INSTDIR\\Syllo.exe" 0
  WriteRegStr HKCU "Software\\Syllo" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "DisplayName" "Syllo"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "DisplayVersion" "{VERSION}"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "Publisher" "Syllo"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "DisplayIcon" "$INSTDIR\\Syllo.exe"
  WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "UninstallString" '"$INSTDIR\\Uninstall.exe"'
  WriteRegDWORD HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "NoModify" 1
  WriteRegDWORD HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo" "NoRepair" 1
SectionEnd

Section "Uninstall"
  SetShellVarContext current
  Delete "$DESKTOP\\Syllo.lnk"
  RMDir /r "$SMPROGRAMS\\Syllo"
  DeleteRegKey HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Syllo"
  DeleteRegKey HKCU "Software\\Syllo"
  RMDir /r "$INSTDIR"
SectionEnd
''',
        encoding="utf-8-sig",
    )
    run(MAKENSIS, script)
    return installer


def main():
    assert OUTPUT.resolve().parent == ROOT.resolve() and OUTPUT.name == "Syllo"
    for required in (RUNTIME, RCEDIT, MAKENSIS, ICON):
        if not required.exists():
            raise SystemExit(f"Missing build input: {required}")
    if BUILD.exists():
        shutil.rmtree(BUILD)
    BUILD.mkdir(parents=True)

    copy_application()
    set_executable_identity()
    write_manifest()

    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    shutil.copytree(STAGING, OUTPUT)
    archive = make_portable_zip()
    installer = make_installer()

    sums = [
        f"{sha256(OUTPUT / 'Syllo.exe')}  Syllo.exe",
        f"{sha256(archive)}  {archive.name}",
        f"{sha256(installer)}  {installer.name}",
    ]
    (OUTPUT / "SHA256SUMS.txt").write_text("\n".join(sums) + "\n", encoding="ascii")
    print(f"Built Syllo {VERSION}: {OUTPUT}")
    print(archive)
    print(installer)


if __name__ == "__main__":
    main()
