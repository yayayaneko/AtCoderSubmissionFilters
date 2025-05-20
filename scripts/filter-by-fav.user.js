// ==UserScript==
// @name         AtcoderSubmissionFilterbyFav
// @namespace    http://tampermonkey.net/
// @version      2025-05-20
// @description  AtCoderの提出一覧をお気に入りユーザーで絞り込む
// @author       yayayaneko
// @license      MIT
// @match        https://atcoder.jp/contests/*/submissions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// ==/UserScript==

(function() {
    "use strict";
    const fav = new Set(localStorage.getItem("fav") ?? []);

    function addCheckbox(applyFilterCallback) {
        const target = document.querySelector(".panel-submission .panel-heading form > div:last-child");
        if (!target) return;

        const div = document.createElement("div");
        div.className = "checkbox";
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox-fav-sub-only";

        checkbox.addEventListener("change", () => {
            applyFilterCallback(checkbox.checked);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" お気に入りのみ表示"));
        div.appendChild(label);
        target.parentNode.insertBefore(div, target);
    }

    function applyFilter(filterflg) {
        const rows = document.querySelectorAll("table tbody tr");
        rows.forEach(row => {
            const username = row.querySelector(`td:nth-child(3)`).innerText.trim();
            row.style.display = (filterflg && !fav.has(username)) ? "none" : "";
        });
    }

    const observer = new MutationObserver(() => {
        const row = document.querySelector("tbody tr");
        if (row){
            observer.disconnect();
            addCheckbox(applyFilter);
            applyFilter(false);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();