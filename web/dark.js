/**
 * @param {jQuery} $link
 */
function handleDarkMode($link) {
    function setDarkMode() {
        $("body").addClass("dark");
    }

    function clearDarkMode() {
        $("body").removeClass("dark");
    }

    if (localStorage.darkMode) {
        setDarkMode();
    }
    $link.click(function (e) {
        e.preventDefault();
        if (localStorage.darkMode) {
            delete (localStorage.darkMode);
            clearDarkMode();
        } else {
            localStorage.darkMode = true;
            setDarkMode();
        }
    });
};
