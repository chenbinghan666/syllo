"""Package the already-downloaded official Electron runtime and local Syllo sources."""
from pathlib import Path
import hashlib
import shutil
import urllib.request

root = Path(__file__).resolve().parents[1]
cache = root / '.dev' / 'electron'
version = (cache / 'version.txt').read_text().strip()
filename = f'electron-v{version}-win32-x64.zip'
checksums = urllib.request.urlopen(f'https://github.com/electron/electron/releases/download/v{version}/SHASUMS256.txt', timeout=30).read().decode()
expected = next(line.split()[0] for line in checksums.splitlines() if line.split()[-1].lstrip('*') == filename)
assert hashlib.sha256((cache / filename).read_bytes()).hexdigest() == expected, 'Electron checksum mismatch'
destination = root / 'releases' / 'Syllo-Desktop-v0.8.0'
shutil.copytree(cache / 'runtime', destination, dirs_exist_ok=True)
electron = destination / 'electron.exe'
if electron.exists():
    electron.rename(destination / 'Syllo.exe')
application = destination / 'resources' / 'app'
application.mkdir(parents=True, exist_ok=True)
for name in ['package.json', 'identity.js', 'visuals.js', 'theme.js', 'semesters.js', 'board.js']:
    shutil.copy2(root / name, application / name)
for name in ['desktop', 'assets']:
    shutil.copytree(root / name, application / name, dirs_exist_ok=True)
print('Verified Electron SHA256; desktop package ready:', destination)
