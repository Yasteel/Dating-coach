$(document).on('click', '.navButtons.client button', function()
{
  let id = $(this).attr('id');
  console.log(id);

  if(!$(this).hasClass('current'))
  {
    switch (id) {
      case '0':
        window.location.href = "daterDashboard.html";
        break;
      case '1':
        window.location.href = "daterReviewer.html";
        break;
      case '2':
        window.location.href = "feedback.html";
        break;
    }
  }
});

$(document).on('click', '.navButtons.coach button', function()
{
  let id = $(this).attr('id');
  console.log(id);

  if(!$(this).hasClass('current'))
  {
    switch (id) {
      case '0':
        window.location.href = "coachDashboard.html";
        break;
      case '1':
        window.location.href = "requests.html";
        break;
    }
  }
});

$(document).on('click','#signout', function()
{
  sessionStorage.setItem('username','');
  sessionStorage.setItem('userType','');

  window.location.href = "index.html";
});

$(document).on('click', '.changePhoto', function()
{
  $('.file_profile_pic').click();
});

$(document).on('click', '.edit_open', function()
{
  clearFields();
  $('.edits').css('display', 'block');
  $('.save').css('transform', 'scaleY(1)');
  $('.gallery').css('display', 'none');
  populateFields();
});

$(document).on('click', '.btn_save', function()
{
  $('.edits').css('display', 'none');
  $('.gallery').css('display', 'flex');
  $('.save').css('transform', 'scaleY(0)');
  saveInfo();
  fetchInfo();
});

$(document).on('click', '.cancel', function()
{
  $('.edits').css('display', 'none');
  $('.gallery').css('display', 'flex');
  $('.save').css('transform', 'scaleY(0)');
});

function get_values(field_class)
{
  let values = [];
  let fields = document.getElementsByClassName(field_class);

  $.each(fields, function(i,v)
  {
    if(v.value)
    {
      values.push(v.value.trim());
    }
  });
  return values;
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

function clearFields()
{
  $.each($('.edits').find('div'),function(i1,v1)
  {
    $.each($(v1).find('textarea'),function(i2,v2)
    {
      $(v2).val('');
    });
    $.each($(v1).find('input'),function(i2,v2)
    {
      $(v2).val('');
    });
  });
}
