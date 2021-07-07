var username, userType;

$(document).ready(function()
{
  username = sessionStorage.getItem('username');
  userType = sessionStorage.getItem('userType');

  if(!username)
  {
    window.location.href = "index.html";
  }

  if(userType == 1)
  {
    $('.edits').removeClass('hide');
  }

  $('#username').val(username);
});

$(document).on('keyup', '.description', function()
{
  $('.count').html(150 - $('.description').val().length);
});

$(document).on('click', '.upload_btn', function()
{
  $('.file').click();
});

$(document).on('click', '.btn_save', function()
{
  var name = $('#name').val().trim();
  var surname = $('#surname').val().trim();
  var age = $('#age').val().trim();
  var gender = $('#gender').val().trim();
  var description = $('#description').val().trim();

  if(userType == 2)
  {
    $.post('php/index.php',
    {
      operation: 'register_coach',
      username: username,
      name: name,
      surname: surname,
      age: age,
      gender: gender,
      description: description
    },
    function(data)
    {
      if(data == 1)
      {
        saveFile(username, userType);
      }
      else
      {
        show_alert('Something went wrong: 0');
      }
    });
  }
  else if(userType == 1)
  {
    var likes = getValues('likes');
    var dislikes = getValues('dislikes');
    var qualities = getValues('qualities');
    var partner = getValues('partner');

    if(likes.length > 0 && dislikes.length > 0 && qualities.length > 0 && partner.length > 0)
    {
      $.post('php/index.php',
      {
        operation: 'register_client',
        username: username,
        name: name,
        surname: surname,
        age: age,
        gender: gender,
        description: description,
        likes: likes,
        dislikes: dislikes,
        qualities: qualities,
        partner: partner
      },
      function(data)
      {
        // console.log(data);
        if(data == 1)
        {
          saveFile(username, userType);
        }
        else
        {
          console.log(data);
          show_alert('Something went wrong: 1');
        }
      });
    }
    else
    {
      show_alert('Enter in at least one value for all Categories');
    }
  }
});


function getValues(field_type)
{
  let values = [];
  let fields = document.getElementsByClassName(field_type);

  $.each(fields, function(i,v)
  {
    if(v.value)
    {
      values.push(v.value.trim());
    }
  });
  return values;
}

async function saveFile(username, userType)
{
  var fileName = "";
  var formData = new FormData();
  formData.enctype = "multipart/form-data";
  formData.method = "post";
  formData.append("file", fileUpload.files[0]);
  formData.append('username',username);
  formData.append('operation','updateProfile');
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
        if(userType == 1)
        {
          sessionStorage.setItem('username',username);
          sessionStorage.setItem('userType',userType);
          show_alert('Profile Created', 0);
          window.location.href = "daterDashboard.html";
        }
        else if(userType == 2)
        {
          sessionStorage.setItem('username',username);
          sessionStorage.setItem('userType',userType);
          show_alert('Profile Created', 0);
          window.location.href = "coachDashboard.html";
        }
        else
        {
          show_alert('Something went wrong: 2');
        }
      }
      else if(result == 1)
      {
        show_alert('something went wrong');
      }

  })
  .catch(error => {console.log("Error: ", error);});
}

function show_alert(message, messageType)
{
  var div =
  `
  <div class="alert_container">
    <div class="alert">`;

  if(messageType == 0)
  {
    div += `<div><i class="far fa-check-circle"></i></div>`;
  }
  else if(messageType == 1)
  {
    div += `<div><i class="far fa-times-circle"></i></div>`;
  }
  else
  {
    div += `<div><i class="fas fa-exclamation-circle"></i></div>`;
  }
    div +=
    `<div class="message">
        <p>${message}</p>
      </div>
      <div class="progress"></div>
    </div>
  </div>
  `;

  $('.wrapper').append(div);

  setTimeout(function()
  {
    $('.alert').addClass('show');
  }, 100);

  setTimeout(function()
  {
    $('.alert_container').remove();
  }, 2000);
}
