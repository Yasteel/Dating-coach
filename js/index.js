var username, userType;

$(document).on('click', '.btn_login', function()
{
  username = $('.txt_username').val();
  userType = $('.user_type').val();
  console.log(`${username} : ${userType}`);

  if(checkValue(username))
  {
    if(username == 'admin' || username == 'Admin')
    {
      window.location.href = "god_access.html";
    }
    else
    {
      if(checkValue(userType))
      {
        $.post('php/index.php', {operation: 'login', username: username, userType: userType}, function(data)
        {
          console.log(data);
          // If user is found then login redirects to respective pages
          if(data == 1)
          {
            sessionStorage.setItem('username',username);
            sessionStorage.setItem('userType',userType);

            if(userType == '1')
            {
              window.location.href = "daterDashboard.html";
            }
            else if(userType == '2')
            {
              window.location.href = "coachDashboard.html";
            }
          }
          // if user not found then User given option to create a Profile
          else if(data == 2)
          {
            $('.card').addClass('hide');
            $('.dialog_box_wrapper').removeClass('hide');
          }
        });
      }
      else
      {
        alert('Incorrect Inputs');
      }
    }
  }
  else
  {
    alert('Incorrect Inputs');
  }
});

$(document).on('click', '.btn.no', function()
{
  $('.card').removeClass('hide');
  $('.dialog_box_wrapper').addClass('hide');
});

$(document).on('click', '.yes', function()
{
  sessionStorage.setItem('username',username);
  sessionStorage.setItem('userType',userType);
  window.location.href = "createProfile.html";
});

// Function to check inputs
function checkValue(value)
{
  if(value && value != 'null')
  {
    return true;
  }
  else
  {
    return false;
  }
}
