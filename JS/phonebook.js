var ids = [];
window.PhoneBook = {

    API_URL: "http://localhost:8081/phonebook",
    getContacts: function () {
        $.ajax({
            url: PhoneBook.API_URL,
            method: "GET"
        }).done(function (response) {
            console.log("GET done");
            console.log(response);
            PhoneBook.displayContacts(JSON.parse(response))
        });
    },
    createContact: function () {
        let firstName = $("#firstName-field").val();
        let lastName = $("#lastName-field").val();
        let phoneNumber = $("#phoneNumber-field").val();
        var requestBody = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
        };

        $.ajax({
            url: PhoneBook.API_URL,
            method: "POST",
            //MIME type
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            PhoneBook.getContacts();

        })

    }, displayContacts: function (contacts) {
        var tableContent = "";
        contacts.forEach(contact => tableContent += PhoneBook.getItemTableRow(contact));
        $("#contacts tbody").html(tableContent);
    },

    getItemTableRow: function (contact) {
        //spread(...)
        //var firstName = contact.firstName;
        //var lastName = contact.lastName;
        // var phoneNumber = contact.phoneNumber
        //ternary operator

        var checkedAttribute = "checked";
        return `<tr>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.phoneNumber}</td>
            <td><input type="checkbox" class="mark-done" data-id = "${contact.id}"/></td>
            <td><a href="#" class="delete-contact" data-id = "${contact.id}">
                <i class="fas fa-recycle"></i></a> </td>
        </tr>`
    }
    ,
    bindEvents: function () {
        $("#create-contact-form").submit(function (event) {
            event.preventDefault();
            PhoneBook.createContact();

        });
        $("#contacts").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            let id = $(this).data("id");
            PhoneBook.deleteContact(id);
        });
        $("#contacts").delegate(".mark-done", "change", function (event) {
            event.preventDefault();
            let id = $(this).data("id");
            if ($(this).is(":checked")) {
                ids.push(id);
            } else {
                if (ids.includes(id)) {
                    ids.splice(ids.indexOf(id), 1);
                }
            }

        });

        //delegate is necessary cause our checkbox is dinamically injected in the page (not preasent from the
        //begining  on the page load)


    },

    deleteContact: function (id) {

        $.ajax({
            url: PhoneBook.API_URL + "?id=" + id,
            method: "DELETE",
        }).done(function () {
            PhoneBook.getContacts();
        });

    },
};

function myFunction() {
    for (var i = 0; i < ids.length; i++) {
        PhoneBook.deleteContact(ids[i]);
    }
}

PhoneBook.getContacts();
PhoneBook.bindEvents();