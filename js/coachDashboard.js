var username, userType;
var userData;

$(document).ready(function()
{
  username = sessionStorage.getItem('username',username);
  userType = sessionStorage.getItem('userType',userType);

  if(!username)
  {
    window.location.href = "index.html";
  }
  else if(userType == 1 || userType == "1")
  {
    window.location.href = "index.html";
  }

  $('.edits').css('display', 'none');
  fetchInfo();
  check_for_jobs(username);
});


$(document).on('change', '.file_profile_pic', function()
{
  saveFile(username, 'updateProfile');
});

$(document).on('keyup', '#description', function()
{
  let length = 150 - ($('#description').val().length);
  $('.char_count').html(`${length} characters left`);
})

function saveInfo()
{
  var name = $('#name').val();
  var surname = $('#surname').val();
  var age = $('#age').val();
  var description = $('#description').val();

  $.post('php/coachDashboard.php',
  {
    operation: 'update',
    username: username,
    name: name,
    surname: surname,
    age: age,
    description: description
  },
  function(data)
  {
    if(data == 1)
    {
      show_alert('Update Successfull', 0);
      fetchInfo();
    }
    else if(data == 2)
    {
      show_alert('Something went wrong');
    }
  });
}

function fetchInfo()
{
  $('#profile_info').html('');
  $.post('php/coachDashboard.php',
  {
    operation: 'fetchData',
    username: username
  },
  function(data)
  {
    userData = JSON.parse(data);

    var rating = userData.rating;
    var info =
     `
      <p><span class="highlight">${userData.first_name} ${userData.surname}</span> <br> ${userData.gender}, ${userData.age}</p>
      <p>${userData.description}</p>
      <div>
        <p>Rating (${userData.rating}):
      `;

    for(i=0; i<rating; i++)
    {
      info += `<i class="fas fa-star highlight"></i>`;
    }

    for(i=0; i<(5-rating); i++)
    {
      info += `<i class="fas fa-star"></i>`;
    }


    info += `</p></div>`;

    $('#profile_info').append(info);
    $('#profile_picture').attr('src', `upload/${userData.profile_picture}`);

  });
}

function populateFields()
{
  $('#name').val(userData.first_name);
  $('#surname').val(userData.surname);
  $('#age').val(userData.age);
  $('#description').val(userData.description);
}

async function saveFile(username, operation)
{
  var fileName = "";
  var formData = new FormData();
  formData.enctype = "multipart/form-data";
  formData.method = "post";
  formData.append("file", fileUpload.files[0]);
  formData.append('username',username);
  formData.append('operation',operation);

  await fetch('php/uploadFile.php',
  {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(function(result)
  {
    if(result == 0)
    {
      show_alert('success', 0);
      fetchInfo();
    }
    else if(result == 1)
    {
      show_alert('Picture Not Added <br> Try again', 1);
    }
  })
  .catch(error => {console.log("Error: ", error);});
}
