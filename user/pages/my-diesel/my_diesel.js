document.addEventListener("DOMContentLoaded", function () {
    const timeSelect = document.getElementById("timeSelect");
    const dateSelect = document.getElementById("dateSelect");
    const arrivalText = document.querySelector(".pickup-card p.mb-3");

    function updateArrivalText() {
        const time = timeSelect.value;
        const date = dateSelect.value;

        if (time && date) {
            arrivalText.innerHTML = `We will arrive to you in <strong>${date} at ${time}</strong>`;
        } else {
            arrivalText.innerHTML = "Please Choose the date and time to take the diesel from you";
        }
    }

    timeSelect.addEventListener("change", updateArrivalText);
    dateSelect.addEventListener("change", updateArrivalText);
});
