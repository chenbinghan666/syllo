# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The requesting XMUM student, initially for personal use. Sharing code on GitHub is a possible later step, not current publication authorization.

## Product Purpose

A more direct Moodle interface. The user explicitly requires a homepage of clear modules including assignments, notices, course materials and grades, with one-click entry and no vertical scrolling or tedious searching on the homepage.

## Operating Context

XMUM Moodle in a desktop browser, using an existing authenticated session. Local preview is fictional; the extension reads same-origin pages. The user has requested several design skills be used to create and compare variants, and delegated selection of the best design.

## Capabilities and Constraints

Vanilla JavaScript and Shadow DOM, a Manifest V3 extension, no server or remote analytics. Preserve raw grades, unknown submission states, source links and UTC+8 dates. Never substitute Moodle home for a missing activity URL. Do not invent timetable or exam coverage. Homepage modules navigate inside the board; real activities open their exact school URLs.

## Evidence on Hand

Existing account page structures were inspected in earlier work. Demo values are fictional and labeled. Live extension sync remains unverified.

## Product Principles

1. Choose a module immediately, without scanning a dashboard feed.
2. Keep detailed lists and calendar inside modules.
3. Preserve source truth and explicitly unknown fields.
4. Do not store or publish account credentials or personal learning data.

## Latest identity constraints

Name: Syllo (English only, no Chinese or pinyin). Light sidebar, no dark brown navigation, no blue interface accents. School mark is read from the connected site, never hardcoded as XMUM. Chinese typography uses Source Han Sans SC.
