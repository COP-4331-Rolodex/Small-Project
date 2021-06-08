var urlBase = 'https://myrolodex.xyz';
var extension = 'php';

var userId;
var firstName = "";
var lastName = "";
var fullName = "";
var contactId = 0;

function doLogin()
{
        userId = 0;
        firstName = "";
        lastName = "";
         fullName = "";

        var username = document.getElementById("username_field").value;
        var password = document.getElementById("password_field").value;
        var hash = md5( password );

        document.getElementById("login_form_submit").innerHTML = "";

//      var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
        var jsonPayload = '{"login" : "' + username + '", "password" : "' + hash + '"}';
        var url = urlBase + '/LAMPAPI/Login.' + extension;

        console.log(jsonPayload);

        if (jsonPayload.login == "" || password == "")
        {
                window.alert("Please fill all required fields.");
                return;
        }


        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                console.log(xhr.responseText);
                                var jsonObject = JSON.parse( xhr.responseText );
                                userId = jsonObject.id;
                                console.log(jsonObject);
                                console.log(userId);
                                if( userId <= 0 )
                                {
                                        document.getElementById("login_form_submit").innerHTML = "User/Password combination incorrect";
                                        window.alert("Please check your the Email/Password provided and try again.");
                                        return;
                                }

                                localStorage.setItem("loginId", userId);

                                fullName = jsonObject.name;

                                saveCookie();
                                window.alert("Welcome!");
                                window.location.href = "contacts_page.html";
                        }
                };
                xhr.send(jsonPayload);
        }
        catch(err)
        {
                window.alert("Please check your the Email/Password provided and try again.");
                document.getElementById("login_form_submit").innerHTML = err.message;
        }

}

function saveCookie()
{
        var minutes = 20;
        var date = new Date();
        date.setTime(date.getTime()+(minutes*60*1000));
        document.cookie = "fullName=" + fullName +  ",userId=" + userId + ";expires=" + date.toGMTString();
        //document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
        userId = -1;
        var data = document.cookie;
        var splits = data.split(",");
        for(var i = 0; i < splits.length; i++)
        {
                var thisOne = splits[i].trim();
                var tokens = thisOne.split("=");
                /*if( tokens[0] == "firstName" )
                {
                        firstName = tokens[1];
                }
                else if( tokens[0] == "lastName" )
                {
                        lastName = tokens[1];
                }*/
                if( tokens[0] == "fullName" )
                {
                        fullName = tokens[1];
                }
                else if( tokens[0] == "userId" )
                {
                        userId = parseInt( tokens[1].trim() );
                }
        }

        if( userId < 0 )
        {
                window.location.href = "index.html";
        }
        else
        {
                document.getElementById("username_field").innerHTML = "Logged in as " + firstName + " " + lastName;
        }
}

function SignUp()
{
        firstName = "";
        lastName = "";
        fullName = "";
        userId = 0;

        var firstName = document.getElementById("sign_up_first").value;
        var lastName = document.getElementById("sign_up_last").value;
        var email = document.getElementById("sign_up_email").value;
        var UnhashedPassword = document.getElementById("sign_up_password").value;
        var hash = md5(UnhashedPassword);
        var terms = document.querySelector('#checked_value');

        var url = urlBase + '/LAMPAPI/Registration.' + extension;

        document.getElementById("signup_form_submit").innerHTML = "";


        fullName = firstName + ' ' + lastName;

        console.log(fullName);

        var sendUserInfo = {
                name: fullName,
                username : email,
                password : hash
        };
        console.log(document.getElementById('checked_value'));

        if (sendUserInfo.name == "" || sendUserInfo.username == "" || sendUserInfo.password == "")
        {
                window.alert("Please fill all required fields.");
                return;
        }
        if (terms.checked == false)
        {
                console.log(document.getElementById('checked_value').checked);
                window.alert("You must accept the terms and conditions to continue.");
                return;
        }

        saveCookie();

        var UserString = JSON.stringify(sendUserInfo);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        //console.log(xhr.readyState);

        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {

                        if (this.readyState == 4 && this.status == 200)
                        {
                                if (xhr.response != "")
                                {
                                        window.alert("A problem occured with creating your account. Please check the information provided.");
                                        return;
                                }
                        document.getElementById("signup_form_submit").innerHTML = "User was created";
                        window.alert("Your account has been created!");
                        //window.location.href = "Search-Contacts(Temporary).html";
                        window.location.href = "index.html";
                        return;
                        }
                };
                console.log(UserString);
                xhr.send(UserString);
        }
        catch(err)
        {
            window.alert("Please check the information that has been entered.");
            document.getElementById("signup_form_submit").innerHTML = err.message;
        }
}

function doAddContact()
{
        firstName = "";
        lastName = "";
        fullName = "";
        var emailaddress = "";
        var phonenumber = "";


        firstName = document.getElementById("change_First_Name").value;
        lastName = document.getElementById("change_Last_Name").value;
        emailaddress = document.getElementById("change_Email_Name").value;
        phonenumber = document.getElementById("change_Phone_Name").value;

        var url = urlBase + '/LAMPAPI/Add.' + extension;

        //document.getElementById("signup_form_submit").innerHTML = "";
        userId = localStorage.getItem("loginId");
        var createContact = {
                owner_id: userId,
                first_name: firstName,
                last_name: lastName,
                email: emailaddress,
                phone: phonenumber
        };

        console.log(createContact);

        if (createContact.id == "" || createContact.username == "" || createContact.password == "" || createContact.email == "" || createContact.phone == "")
        {
                window.alert("Please fill all required fields.");
                return;
        }

        var newContact = JSON.stringify(createContact);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                if (xhr.response != "")
                                {
                                        window.alert("A problem occured with creating the contact. Please check the information provided.");
                                        return;
                                }
                        //document.getElementById("signup_form_submit").innerHTML = "User was created";
                        window.alert("A new contact has been created!");
                        //window.location.href = "Search-Contacts(Temporary).html";
                        return;
                        }
                };
                console.log(newContact);
                xhr.send(newContact);
        }
        catch(err)
        {
            window.alert("Please check the information that has been entered.");
            //document.getElementById("signup_form_submit").innerHTML = err.message;
        }

}

function doDeleteContact()
{
        //userId = localStorage.getItem("currentID");localStorage.getItem("currentID")
        //document.getElementById("DeleteUser").innerHTML = "";
        //contactId = 0;

        contactId = document.getElementById("DeleteUser").value;//Needs to be updated with parameter from html page;

        var userToDelete = {
                id: contactId
        };

        console.log(userToDelete);

        var deletedUser = JSON.stringify(userToDelete);

        if (window.confirm("Are you sure you want to delete this contact?") == false)
        {
                return;
        }

        console.log(deletedUser);
        var url = urlBase + '/LAMPAPI/Delete.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {

                               /* if (xhr.response != "Record deleted successfully.")
                                {
                                        console.log(xhr.response);
                                        window.alert("A problem occured with deleting the user.");
                                        return;
                                }*/
                                window.alert("Your contact was succesfully deleted!");
                                window.location.href = "Search-Contacts(Temporary).html";
                        }
                };
                xhr.send(deletedUser);
        }
        catch(err)
        {
                window.alert("ID is invalid");
                //document.getElementById("DeleteUser").innerHTML = err.message;
        }
}

function doUpdateContact()
{
        firstName = "";
        lastName = "";
        fullName = "";

        contactId = document.getElementById("DeleteUser").value;
        firstName = document.getElementById("change_First_Name").value;
        lastName = document.getElementById("change_Last_Name").value;
        var phonenumber = document.getElementById("change_Phone_Name").value;
        var emailaddress = document.getElementById("change_Email_Name").value;

        var url = urlBase + '/LAMPAPI/Update.' + extension;

        //document.getElementById("signup_form_submit").innerHTML = "";

        var updateContact = {
                id: contactId,
                first_name: firstName,
                last_name: lastName,
                email: emailaddress,
                phone: phonenumber
        };

        console.log(updateContact);

        if (updateContact.id == "" || updateContact.username == "" || updateContact.password == "" || updateContact.email == "" || updateContact.phone == "")
        {
                window.alert("Please fill all required fields in order to update the contact.");
                return;
        }

        var updated = JSON.stringify(updateContact);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                if (xhr.response != "Record updated successfully.")
                                {
                                        console.log(xhr.response);
                                        window.alert("A problem occured with updating the contact. Please check the information provided.");
                                        return;
                                }
                        //document.getElementById("signup_form_submit").innerHTML = "User was created";
                        window.alert("Contact has been updated!");
                        window.location.reload(true);
                        return;
                        }
                };
                console.log(updated);
                xhr.send(updated);
        }
        catch(err)
        {
            window.alert("Please check the information that has been entered.");
            //document.getElementById("signup_form_submit").innerHTML = err.message;
        }
}

function doLogout()
{
        userId = 0;
        fullName = "";
        document.cookie = "fullName= ; expires = Thu, 01 Jan 1950 00:00:00 GMT";
        window.location.href = "index.html";
}

function showPassword()
{
        var hidePass = document.getElementById("password_field");
        if (hidePass.type === "password")
        {
                hidePass.type = "text";
        }
        else
        {
                hidePass.type = "password";
        }
}

function doSearch()
{
        contactId = 0;
        var search = document.getElementById("search").value;
        userId = localStorage.getItem("loginId");
        var firstName = "";
        var lastName = "";
        const newContactDiv = "";
        const listContactInfoDiv = "";
        var searchContacts = {
                id: userId,
                name: search
        };

        var contactsFound = JSON.stringify(searchContacts);

        var url = urlBase + '/LAMPAPI/Search.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if(this.readyState == 4 && this.status == 200)
                        {
                                const newHeaderTab = document.querySelector('.contacts_container_3');
                                const newSideTab = document.querySelector('.contacts_container_4');
                                if (xhr.response == "")
                                {
                                        window.alert("There was a problem with the search. Please try again.");
                                        return;
                                }

                                // Clears out table on new search
                                /*while(table.rows.length > 1) {
                                        table.deleteRow(table.rows.length - 1);
                                }*/
                                console.log(xhr.response);

                                //var jsonObject = JSON.parse( xhr.responseText );
                                //res = (jsonObject.results).split(" ");
                                //var length = res.length/5;
                                //length = jsonObject.results.length;
                                clearTabs(newContactDiv);
                                clearTabs(listContactInfoDiv);

                                var length = jsonObject.results.length;
                                for( var i=0; i<length; i++ )
                                {
                                singleContact = (jsonObject.results[i]).split(" ");

                                        newContactDiv = document.createElement('div');
                                        newContactDiv.classList.add('newContact');
                                        newContactDiv.innerHTML = `
                                        <div class="tab">
                                                <button class="tablinks" onclick="openContact(event, 'Mariana')" id="defaultOpen">
                                                <div id = "contact_label">
                                                <img id="contact_id" src="https://eu.ui-avatars.com/api/?name=Mariana+Botero&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div class ="contact_label">
                                                        <div id ="contact_name_field">`+ singleContact[0] + " " + singleContact[1] + `</div>
                                                        <div id ="contact_rel_field">Friend</div>
                                                </div>
                                        </div>
                                </button>
                                </div>`;

                                newHeaderTab.appendChild(newContactDiv);

                                //<!--Hiden tab-->

                                listContactInfoDiv = document.createElement('div');
                                listContactInfoDiv.classList.add('contactInfo');
                                listContactInfoDiv.innerHTML = `
                                <div id="Mariana" class="tabcontent">

                                        <div class = "first_half">
                                                <img id="contact_id_content" src="https://eu.ui-avatars.com/api/?name=Mariana+Botero&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div id = "name">` + singleContact[0] + " " + singleContact[1] + `</div>
                                                <div class = delete_btn_wrap id = "deleteContact">
                                                <a onclick="doDeleteContact();" class= "delete_btn"> Delete </a>
                                        </div>
                                </div>
                                <div id = "phone_label">Phone</div>
                                <div id = "phone">` + singleContact[2] + `</div>
                                <div id = "email_label">E-mail</div>
                                <div id = "email">` + singleContact[3] + `</div>
                                <div class = "edit_btn_wrap">
                                        <a onclick="doUpdateContact();" class= "edit_btn" id = "editContact"> Update </a>
                                </div>
                        </div>
                </div>`
                        document.getElementById('deleteContact').value= singleContact[4];
                        document.getElementById('editContact').value= singleContact[4];
                        newSideTab.appendChild(listContactInfoDiv);
                                }
                        }
                };
                xhr.send(contactsFound);
        }
        catch(err)
        {
                windows.alert("An error occured.");
        }
}

function doShowAllContacts()
{
        contactId = 0;
        userId = localStorage.getItem("loginId");
        var firstName = "";
        var lastName = "";
        const newContactDiv = "";
        const listContactInfoDiv = "";

        var showContacts = {
                id: userId,
        };

        var displayContacts = JSON.stringify(showContacts);

        var url = urlBase + '/LAMPAPI/List.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {
                        if (this.readyState == 4 && this.status == 200)
                        {
                                const newHeaderTab = document.querySelector('.contacts_container_3');
                                const newSideTab = document.querySelector('.contacts_container_4');

                                clearTabs(newContactDiv);
                                clearTabs(listContactInfoDiv);
                                var jsonObject = JSON.parse( xhr.responseText );
                                
                                var length = jsonObject.results.length;
                                for( var i=0; i<length; i++ )
                                {
                                singleContact = (jsonObject.results[i]).split(" ");

                                        newContactDiv = document.createElement('div');
                                        newContactDiv.classList.add('newContact');
                                        newContactDiv.innerHTML = `
                                        <div class="tab">
                                                <button class="tablinks" onclick="openContact(event, 'Mariana')" id="defaultOpen">
                                                <div id = "contact_label">
                                                <img id="contact_id" src="https://eu.ui-avatars.com/api/?name=Mariana+Botero&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div class ="contact_label">
                                                        <div id ="contact_name_field">`+ singleContact[0] + " " + singleContact[1] + `</div>
                                                        <div id ="contact_rel_field">Friend</div>
                                                </div>
                                        </div>
                                </button>
                                </div>`;

                                newHeaderTab.appendChild(newContactDiv);

                                //<!--Hiden tab-->

                                listContactInfoDiv = document.createElement('div');
                                listContactInfoDiv.classList.add('contactInfo');
                                listContactInfoDiv.innerHTML = `
                                <div id="Mariana" class="tabcontent">

                                        <div class = "first_half">
                                                <img id="contact_id_content" src="https://eu.ui-avatars.com/api/?name=Mariana+Botero&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div id = "name">` + singleContact[0] + " " + singleContact[1] + `</div>
                                                <div class = delete_btn_wrap id = "deleteContact">
                                                <a href="#something" class= "delete_btn"> Delete </a>
                                        </div>
                                </div>
                                <div id = "phone_label">Phone</div>
                                <div id = "phone">` + singleContact[2] + `</div>
                                <div id = "email_label">E-mail</div>
                                <div id = "email">` + singleContact[3] + `</div>
                                <div class = "edit_btn_wrap">
                                        <a onclick class= "edit_btn" id = "editContact"> Edit </a>
                                </div>
                        </div>
                </div>`
                        document.getElementById('deleteContact').value= singleContact[4];
                        document.getElementById('editContact').value= singleContact[4];
                        newSideTab.appendChild(listContactInfoDiv);
                                }
                        }
                };
                xhr.send(displayContacts);
        }
        catch(err)
        {
                windows.alert("An error occured.");
        }
}

function clearTabs(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
}