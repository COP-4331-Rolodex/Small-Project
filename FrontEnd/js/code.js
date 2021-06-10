var urlBase = 'https://myrolodex.xyz';
var extension = 'php';

var userId;
var firstName = "";
var lastName = "";
var fullName = "";
var contactId = 0;
var newContactDiv = "";
var listContactInfoDiv = "";
var nameKey = "";


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

function doDeleteContact(contactId)
{
        //userId = localStorage.getItem("currentID");localStorage.getItem("currentID")
        //document.getElementById("DeleteUser").innerHTML = "";
        //contactId = 0;

        //contactId = document.getElementById("DeleteUser").value;//Needs to be updated with parameter from html page;

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
                                window.location.reload(true);
                                //window.location.href = "Search-Contacts(Temporary).html";
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

function doUpdateContact(contactId)
{
        firstName = "";
        lastName = "";
        fullName = "";
	
	

        //contactId = document.getElementById("DeleteUser").value;
        firstName = document.getElementById("change_First_Name").value;
        lastName = document.getElementById("change_Last_Name").value;
        var phonenumber = document.getElementById("change_Phone_Name").value;
        var emailaddress = document.getElementById("change_Email_Name").value;
	
        if (contactId == 0)
        {
                contactId = localStorage.getItem(nameKey);
                console.log(contactId);
        }


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
        console.log("Search");
        contactId = 0;
        var search = document.getElementById("search").value;
        userId = localStorage.getItem("loginId");
        var firstName = "";
        var lastName = "";

        var firstPageLoad = 0;

        if (firstPageLoad != 0)
        {
                 //document.getElementById(contacts_container_3).innerHTML = "";
                 //document.getElementById(contacts_container_4).innerHTML = "";
                clearTabs(contacts_container_3);
                clearTabs(contacts_container_4);
        }
        else
        {
                firstPageLoad++;
        }

        console.log(firstPageLoad);

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
                                var newHeaderTab = document.querySelector('#contacts_container_3');
                                var newSideTab = document.querySelector('#contacts_container_4');


                                if (xhr.response == "")
                                {
                                        window.alert("There was a problem with the search. Please try again.");
                                        return;
                                }


                                console.log(xhr.response);

                                var jsonObject = JSON.parse( xhr.responseText );
                                var readId = jsonObject[0].id;

                                if (!jsonObject[0].id)
                                {
                                         clearTabs(newContactDiv);
                                        clearTabs(listContactInfoDiv);
                                        return;
                                }
                                else if (jsonObject[0].id == 0)
                                {
                                         clearTabs(newContactDiv);
                                         clearTabs(listContactInfoDiv);
                                        return;
                                }
                                else
                                {
                                        ;
                                }

                                clearTabs(newContactDiv);
                                clearTabs(listContactInfoDiv);


                                var length = jsonObject.length;
                                for( var i=0; i<length; i++ )
                                {
                                        // singleContact = (jsonObject.results[i]).split(" ");
                                         console.log(readId);

                                        //var jsonObject = JSON.parse( xhr.responseText );
                                        if (readId == 0)
                                        {
                                                 clearTabs(newContactDiv);
                                                 clearTabs(listContactInfoDiv);
                                                return;
                                        }

                                        newContactDiv = document.createElement('div');
                                        newContactDiv.classList.add('newContact');
                                        newContactDiv.innerHTML = `
                                        <div class="tab">
                                                <button class="tablinks" onclick="openContact(event, '`+jsonObject[i].id+`')" id="defaultOpen">
                                                <div id = "contact_label">
                                                <img id="contact_id" src="https://eu.ui-avatars.com/api/?name=`+jsonObject[i].first_name+`+`+jsonObject[i].last_name+`&rounded=true&color=2F2A4A&background=FFFFFF">

                                                <div class ="contact_label">
                                                        <div id ="contact_name_field">`+ jsonObject[i].first_name + " " + jsonObject[i].last_name + `</div>
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
                                <div id="`+jsonObject[i].id+`" class="tabcontent">

                                        <div class = "first_half">
                                                <img id="contact_id_content" src="https://eu.ui-avatars.com/api/?name=`+jsonObject[i].first_name+`+`+jsonObject[i].last_name+`&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div id = "name">` + jsonObject[i].first_name + " " + jsonObject[i].last_name + `</div>
                                                <div class = delete_btn_wrap id = "deleteContact">
                                                <a onclick="doDeleteContact(`+jsonObject[i].id+`);" class= "delete_btn"> Delete </a>
                                        </div>
                                </div>
                                <div id = "phone_label">Phone</div>
                                <div id = "phone">` + jsonObject[i].phone + `</div>
                                <div id = "email_label">E-mail</div>
                                <div id = "email">` + jsonObject[i].email + `</div>
                                <div class = "edit_btn_wrap">
                                        <a onclick="document.getElementById('myModal').style.display='block'" class= "edit_btn" id = "editContact"> Update </a>
				</div>
                        </div>
                </div>`
                                        /*document.addEventListener("DOMContentLoaded", function () {
                                                 document.getElementById('deleteContact').value= jsonObject[i].id;
                                                document.getElementById('editContact').value= jsonObject[i].id;
                                                console.log(document.getElementById('deleteContact').value);
                                              console.log(document.getElementById('editContact').value);
                                        });*/
					nameKey = jsonObject[i].first_Name;
					localStorage.setItem(nameKey, jsonObject[i].id);

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
         console.log("Contacts");
        contactId = 0;
        userId = localStorage.getItem("loginId");
        var firstName = "";
        var lastName = "";
        var firstPageLoad = 0;
        var search = document.getElementById("search").value;

        if (firstPageLoad != 0)
        {
                  document.getElementById(contacts_container_3).innerHTML = "";
                  document.getElementById(contacts_container_4).innerHTML = "";
        }
        else
        {
                firstPageLoad++;
        }

        var showContacts = {
                id: userId,
        };

        var displayContacts = JSON.stringify(showContacts);

        console.log(displayContacts);

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
                                var newHeaderTab = document.querySelector('#contacts_container_3');
                                var newSideTab = document.querySelector('#contacts_container_4');

                                console.log(xhr.response);

                                var jsonObject = JSON.parse( xhr.responseText );
				var readId = jsonObject[0].id;
                                if (!jsonObject[0].id)
                                {
                                        return;
                                }
                                var length = jsonObject.length;
                                for( var i=0; i<length; i++ )
                                {
                                console.log(jsonObject[i].first_name);
					readId = jsonObject[i].id;
					console.log(readId);
                                        newContactDiv = document.createElement('div');
                                        newContactDiv.classList.add('newContact');
                                        newContactDiv.innerHTML = `
                                       <div class="tab">
                                                <button class="tablinks" onclick="openContact(event, '`+ readId +`')" id="defaultOpen">
                                                <div id = "contact_label">
                                                <img id="contact_id" src="https://eu.ui-avatars.com/api/?name=`+jsonObject[i].first_name+`+`+jsonObject[i].last_name+`&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div class ="contact_label">
                                                        <div id ="contact_name_field">`+ jsonObject[i].first_name + " " + jsonObject[i].last_name + `</div>
                                                        <div id ="contact_rel_field">Friend</div>
                                                </div>
                                        </div>
                                </button>
                                </div>`;

                               newHeaderTab.appendChild(newContactDiv);

                                //<!--Hiden tab-->

                                listContactInfoDiv = document.createElement('div');
                                listContactInfoDiv.classList.add('contactInfo');
                                listContactInfoDiv.innnerHTML = `
                                <div id="`+jsonObject[i].id+`" class="tabcontent">

                                        <div class = "first_half">
                                                <img id="contact_id_content" src="https://eu.ui-avatars.com/api/?name=`+jsonObject[i].first_name+`+`+jsonObject[i].last_name+`&rounded=true&color=2F2A4A&background=FFFFFF">
                                                <div id = "name">` + jsonObject[i].first_name + " " + jsonObject[i].last_name + `</div>
                                                <div class = delete_btn_wrap id = "deleteContact">
                                                <a onclick = "doDeleteContact(`+jsonObject[i].id+`);" =  class= "delete_btn" value = "0" id="deleteContact"> Delete </a>
                                        </div>
                                </div>
                                <div id = "phone_label">Phone</div>
                                <div id = "phone">` + jsonObject[i].phone + `</div>
                                <div id = "email_label">E-mail</div>
                                <div id = "email">` + jsonObject[i].email + `</div>
                                <div class = "edit_btn_wrap">
                                        <a onclick = "doUpdateContact(`+jsonObject[i].id+`);" class= "edit_btn" id = "editContact"> Update </a>
                                </div>
                        </div>
                </div>`
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

    var p = parent.parentNode;
        if (p == null)
        {
                return;
        }
    while (p.firstChild) {
            console.log(p.firstChild);
        p.removeChild(p.firstChild);
    }
    console.log(p);
    parent.remove(p);
p.innerHTML = "";
}
