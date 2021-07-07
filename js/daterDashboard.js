var username, userType, userData;

$(document).ready(function()
{
  username = sessionStorage.getItem('username',username);
  userType = sessionStorage.getItem('userType',userType);

  if(!username)
  {
    console.log(username);
    window.location.href = "index.html";
  }
  else if(userType == 2 || userType == "2")
  {
    console.log(username);
    window.location.href = "index.html";
  }

  fetchInfo();
  fetchGallery();
});

$(document).on('click', '.addPhoto', function()
{
  $('.file_uploads').click();
});

$(document).on('change', '.add_picture', function()
{
  saveFile(username, 'addPicture');
  fetchGallery();
});

$(document).on('change', '.file_profile_pic', function()
{
  saveFile(username, 'updateProfile');
});

$(document).on('keyup', '#description', function()
{
  var char_count = 150-($(this).val().length);
  $('.char_count').html(`${char_count} characters left`);
});

function fetchInfo()
{
  $('#profile_info').html('');

  $.post('php/daterDashboard.php',
  {
    operation: 'fetchData',
    username: username
  },
  function(data)
  {
    var allData = JSON.parse(data);
    likes = [];
    dislikes = [];
    my_qualities = [];
    partner_qualities = [];

    $.each(allData,function(i,v)
    {
      name = v.first_name;
      surname = v.surname;
      gender = v.gender;
      age = v.age;
      description = v.description;
      profile_picture = v.profile_picture;

      // Likes and Dislikes
      if(v.ltype == 1)
      {
        if($.inArray(v.likes,likes) < 0)
        {
          likes.push(v.likes);
        }
      }
      else if(v.ltype == 0)
      {
        if($.inArray(v.likes,dislikes) < 0)
        {
          dislikes.push(v.likes);
        }
      }
      // Qualities
      if(v.qtype == 1)
      {
        if($.inArray(v.qualities,my_qualities) < 0)
        {
          my_qualities.push(v.qualities);
        }
      }
      else if(v.qtype == 0)
      {
        if($.inArray(v.qualities,partner_qualities) < 0)
        {
          partner_qualities.push(v.qualities);
        }
      }
    });
      var info =
      `
      <p><span class="highlight">${name} ${surname}</span> <br> ${gender}, ${age}</p>
      <p>${description}</p>
      <p><span class="highlight">Likes: </span> ${likes}</p>
      <p><span class="highlight">Dislikes: </span> ${dislikes}</p>
      <p><span class="highlight">My Qualities: </span> ${my_qualities}</p>
      <p><span class="highlight">Partner Qualities: </span> ${partner_qualities}</p>
      `;

      $('#profile_info').append(info);
      $('#profile_picture').attr('src', `upload/${profile_picture}`);
  });
}

function saveInfo()
{
  var likes = getValues('likes');
  var dislikes = getValues('dislikes');
  var qualities = getValues('qualities');
  var partner = getValues('partner');
  var description = $('#description').val().trim();

  if(likes.length > 0 && dislikes.length > 0 && qualities.length > 0 && partner.length > 0)
  {
    $.post('php/daterDashboard.php',
    {
      operation: 'saveInfo',
      username: username,
      likes: likes,
      dislikes: dislikes,
      qualities: qualities,
      partner: partner,
      description: description
    },
    function(data)
    {
      if(data == 1)
      {
        show_alert('Update Successful', 0);
        fetchInfo();
      }
      else
      {
        console.log('Something went wrong: ', data);
      }
    });
  }
  else
  {
    show_alert('Enter in at least one value for all Categories');
  }
}

function populateFields()
{
  var count = 0;
  $.each(likes, function(i,v)
  {
    document.getElementsByClassName('likes')[count].value = v;
    count++;
  });
  count = 0;
  $.each(dislikes, function(i,v)
  {
    document.getElementsByClassName('dislikes')[count].value = v;
    count++;
  });
  count = 0;
  $.each(my_qualities, function(i,v)
  {
    document.getElementsByClassName('qualities')[count].value = v;
    count++;
  });
  count = 0;
  $.each(partner_qualities, function(i,v)
  {
    document.getElementsByClassName('partner')[count].value = v;
    count++;
  });

  document.getElementById('description').value = description;
}

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

async function saveFile(username, operation)
{
  var fileName = "";
  var formData = new FormData();
  formData.enctype = "multipart/form-data";
  formData.method = "post";

  if(operation == 'updateProfile')
  {
    console.log('update');
    formData.append("file", fileUpload.files[0]); //works with ID attribute of file input
  }
  else if (operation == 'addPicture')
  {
    console.log('add');
    formData.append("file", addPicture.files[0]);
  }

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
      fetchInfo();
      fetchGallery();
      show_alert('Uploaded Picture Successfully', 0);
    }
    else if(result == 1)
    {
      show_alert('fuck', 1);
    }
  })
  .catch(error => {console.log("Error: ", error);});
}

function fetchGallery()
{
  $.post('php/daterDashboard.php',
  {
    operation: 'fetchGallery',
    username: username
  },
  function(data)
  {
    var append = "";
    if(data == 1)
    {
      append =+ `<div><h2 class="highlight">No Photos :(</h2></div>`;
    }
    else
    {
      var pictures = JSON.parse(data);
      console.log(pictures);

      $.each(pictures, function(i,v)
      {
        append +=
        `
        <div class="photo"><img src="upload/${v.image}" alt="${v.image}"></div>
        `;
      });

      $('.photos').html('');
      $('.photos').append(append);
    }



  });
}
