// grabbing all the data switcher attributes
window.onload = () => {
    const tab_switchers = document.querySelectorAll('[data-switcher]');

    for (let i = 0; i < tab_switchers.length; i++) {
        const tab_switcher = tab_switchers[i];
        const page_id = tab_switcher.dataset.tab;

        tab_switcher.addEventListener('click', () => {
            document.querySelector('.tabs .tab.is-active').classList.remove('is-active');
            tab_switcher.parentNode.classList.add('is-active');

            SwitchPage(page_id);
        });
    }
}

// creating function to switch page
function SwitchPage(page_id) {
    console.log(page_id);

    const current_page = document.querySelector('.pages .page.is-active');
    current_page.classList.remove('is-active');

    const next_page = document.querySelector(`.pages .page[data-page="${page_id}"]`);
    next_page.classList.add('is-active');
}

var container = document.querySelector('.container');

// selecting all seats that are not occupied
var seatsAll = document.querySelectorAll('.row .seat');

var seats = document.querySelectorAll('.row .seat:not(.occupied)');

var bookButton = document.getElementById('bookButton');
var reservationList = document.getElementById('reservation');
var displayListButton = document.getElementById('displayListButton');

// counting the seats selected
var count = document.getElementById('count');
var total = document.getElementById('total');
var ticketSelect = document.getElementById('Ticket');

// temp holder
var selectedSeats = []

function display() {
    var reservations = localStorage.getItem('storedSeats')
    if (reservationList.innerHTML.trim().length > 0) {
        reservationList.innerHTML = ""
    } else if (reservations !== null) {
        var parsedReservations = JSON.parse(reservations)
        var str = ''
        parsedReservations.forEach(function (reservation, index) {
            str += '<tr>' +
                '<td>' + reservation.index + '</td>' +
                '<td>' + reservation.name + '</td>' +
                '<td>' + reservation.phoneNumber + '</td>' +
                '<td>' + reservation.selectedlength + '</td>' +
                '<td>' + reservation.timeStamp + '</td>' +
                '<td>' + `<button onclick='cancel("${index}")'>` + "Cancel Reservation" + "</button>" + '</td>'
                + '</tr>';
        });
        reservationList.innerHTML = str
    }
}

// creating reservation list button, every time a click happens, the function "display" will be invoked from local storage
displayListButton.addEventListener('click', (e) => {
    e.preventDefault()
    display()
})

function cancel(index) {
    var reservations = localStorage.getItem('storedSeats')
    var parsedReservations = JSON.parse(reservations);
    var selectedSeats = parsedReservations[index].selectedSeats

    var result = confirm("Do you want to cancel this reservation?")
    if (result === true) {
        var occupiedSeats = localStorage.getItem("occupiedSeats")
        var parsedOccupiedSeats = JSON.parse(occupiedSeats);

        selectedSeats.forEach((seatNumber) => {
            parsedOccupiedSeats.splice(parsedOccupiedSeats.indexOf(seatNumber), 1)
        })
        localStorage.setItem("occupiedSeats", JSON.stringify(parsedOccupiedSeats));

        parsedReservations.splice(index, 1);
        localStorage.setItem("storedSeats", JSON.stringify(parsedReservations));
        display()
        renderSeatsState()
    }
}

function renderSeatsState() {
    var occupiedSeats = localStorage.getItem("occupiedSeats")
    seats.forEach((seat, index) => {
        if (
            occupiedSeats !== null &&
            JSON.parse(occupiedSeats).indexOf(index) > -1
        ) {
            seat.classList.add("occupied");
        } else {
            seat.classList.remove("occupied");
        }
    })
}

// making ticketprice a number
var ticketPrice = +ticketSelect.value;

//save selected movie index and price
function setTicketData(ticketIndex, ticketPrice) {
    localStorage.setItem('selectedTicketIndex', ticketIndex);
    localStorage.setItem('selectedTicketPrice', ticketPrice);
}

//update total and count
function updateSelectedCount() {
    var newlyselectedSeats = document.querySelectorAll('.row .seat.selected')

    var seatsIndexes = [...newlyselectedSeats].map(function (seat) {
        return [...seats].indexOf(seat);
    });

    selectedSeats = seatsIndexes

    var selectedSeatsCount = newlyselectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

//ticket select event
ticketSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setTicketData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
})

// Seat click event
container.addEventListener('click', (e) => {

    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');

        updateSelectedCount();
    }
});

bookButton.addEventListener('click', (e) => {
    e.preventDefault()

    var storedSeats = []
    if (localStorage.getItem("storedSeats") !== null) {
        storedSeats = JSON.parse(localStorage.getItem("storedSeats"))
    }

    // creating error message/validator when no seats selected
    if (selectedSeats.length === 0) {
        alert("No seats selected. Please select seat(s) first")
        return
    }

    var name = document.getElementById("name").value
    var phoneNumber = document.getElementById("phoneNumber").value
    var timeStamp = document.getElementById("timeStamp").value

    var booking = {
        index: storedSeats.length + 1,
        name: name,
        phoneNumber: phoneNumber,
        timeStamp: timeStamp,
        selectedSeats: selectedSeats,
    }


    storedSeats.push(booking)

    var savedSelectedSeats = localStorage.getItem("occupiedSeats")
    if (savedSelectedSeats !== null) {
        savedSelectedSeats = JSON.parse(savedSelectedSeats)
        savedSelectedSeats = savedSelectedSeats.concat(selectedSeats)
        localStorage.setItem("occupiedSeats", JSON.stringify(savedSelectedSeats))
    } else {
        savedSelectedSeats = selectedSeats
        localStorage.setItem("occupiedSeats", JSON.stringify(selectedSeats))

    }

    localStorage.setItem("storedSeats", JSON.stringify(storedSeats))

    var result = confirm("Ticket has been booked.")
    if (result === true) {
        if (savedSelectedSeats.length === 25) {
            alert("All seats have been taken. There can be no further reservations to be made.")
        }
        window.location.reload();
    }
});

updateSelectedCount();
renderSeatsState();

display();