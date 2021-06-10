var urlBase = 'https://myrolodex.xyz';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

// const addTab = document.getElementById('addcontact-btn');
// const addContent = document.getElementById('addcontact-btn');



// function Contact(id, firstName, lastName, email, phone){
//     this.id = id;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.email = email;
//     this.phone = phone;
//
// }

function openContact(evt, content) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(content).style.display = "block";
  evt.currentTarget.className += " active";
}

function addTab(){
        const newTabDiv = document.createElement('div');
        newTabDiv.classList.add('tab-item');
        newTabDiv.innerHTML = `
        <div class="tab">
          <button class="tablinks" onclick="openContact(event, 'Content')" id="defaultOpen">
              <div id = "contact_label">
                  <img id="contact_id" src="https://source.unsplash.com/500x500/?simple,flower">
                  <div class ="contact_label">
                    <div id ="contact_first_name_field">test</div>
                    <div id ="contact_last_name_field">test</div>
                    <div id ="contact_rel_field">Friend</div>
                 </div>
              </div>
         </button>`
         ;
         document.getElementById('contacts_container_3').appendChild(newTabDiv);

         const newContentDiv = document.createElement('div');
         newContentDiv.classList.add('content-item');
         newContentDiv.innerHTML = `

          <div id="Content" class="tabcontent">
              <div class = "first_half">
                  <img id="contact_id_content" src="https://source.unsplash.com/500x500/?simple,flower">

                  <div id = "first_name">test</div>
                  <div id = "last_name">test</div>
		  <div class = delete_btn_wrap>
                      <a href="#something" class= "delete_btn"> Delete </a>
                  </div>
              </div>
                <div id = "phone_label">Phone</div>
                <div id = "phone">test</div>
                <div id = "email_label">E-mail</div>
                <div id = "email">test</div>
                <div class = "edit_btn_wrap">
                    <a onclick="document.getElementById('myModal_edit').style.display='block'" class= "edit_btn"> Update </a>
                </div>
          </div>
          `;
          document.getElementById('contacts_container_4').appendChild(newContentDiv);
}
