var username, userType, userData;

$(document).ready(function()
{
  username = sessionStorage.getItem('username',username);
  userType = sessionStorage.getItem('userType',userType);

  if(!username)
  {
    window.location.href = "index.html";
  }
  else if(userType == 2 || userType == "2")
  {
    window.location.href = "index.html";
  }

  fetchCoaches();
});

$(document).on('click', '.coach', function()
{
  displayDetails($(this).attr('data-index'));

  $('.coach').removeClass('selected');
  $(this).addClass('selected');
});

$(document).on('click', '.btn_submit', function()
{
  let coach = $(this).attr('data-username');

  $.post('php/daterReviewer.php',
  {
    operation: 'checkSubmit',
    client_username: username,
    coach_username: coach
  },
  function(data)
  {
    if(data == 1)
    {
      show_alert(`Already Submitted to ${coach}`);
    }
    else if(data == 0)
    {
      $.post('php/daterReviewer.php',
      {
        operation: 'submitForRewiew',
        dater: username,
        coach: coach,
        status: 0
      },
      function(data)
      {
        console.log(data);
        if(data == 0)
        {
          show_alert('Already Submitted 5 Reviewals');
        }
        else if (data = 1)
        {
          show_alert('Success', 0);
          displayDetails();
        }
      });
    }
  });
});

function fetchCoaches()
{
  $('.list').html('');
  $.post('php/daterReviewer.php',
  {
    operation: 'fetchCoaches'
  },
  function(data)
  {
    if(data == 0 || data == 1 || data == 2)
    {
      console.log(data);
      $('.list').append('<h2 class="highlight">No Coaches Found :(</h2>');
    }
    else
    {
      userData = JSON.parse(data);
      console.log(userData);
      $.each(userData, function(i,v)
      {
        var list =
        `
        <div class="coach" data-id="${v.username}" data-index="${i}">
          <div class="profile_picture">
            <img src="upload/${v.profile_picture}" alt="">
          </div>
          <div class="short_detail">
            <p class="highlight">${v.first_name} ${v.surname}</p>
            <p>${v.gender}, ${v.age}</p>
          </div>
        </div>
        `;
        $('.list').append(list);
      });
    }
  });
}

function displayDetails(index)
{
  $('.full_detail').html('');
  let user = userData[index];
  var rating = user.rating;
  var details = "";


  $.post('php/daterReviewer.php',
  {
    operation: 'checkSubmit',
    client_username: username,
    coach_username: user.username
  },
  function(data)
  {
    if(data == 1)
    {
      details =
      `
        <p><span class="highlight">${user.first_name} ${user.surname}</span> <br> ${user.gender}, ${user.age}</p>
        <p class="description">${user.description}</p>
        <div>
          <p>Rating (${user.rating}):
        `;

        if(rating > 0)
        {
          for(i=0; i<rating; i++)
          {
            details += `<i class="fas fa-star highlight"></i>`;
          }

          for(i=0; i<(5-rating); i++)
          {
            details += `<i class="fas fa-star"></i>`;
          }
        }
        else
        {
          details += 'No Rating Yet';
        }

      details +=
      `</p></div>
      <button class="btn_submit sent" disabled>Profile Submitted</button>
      `;

      $('.full_detail').append(details);
    }
    else
    {
      details =
      `
        <p><span class="highlight">${user.first_name} ${user.surname}</span> <br> ${user.gender}, ${user.age}</p>
        <p class="description">${user.description}</p>
        <p class="rating">
          Rating (${user.rating}):
      `;

        if(rating > 0)
        {
          for(i=0; i<rating; i++)
          {
            details += `<i class="fas fa-star highlight"></i>`;
          }

          for(i=0; i<(5-rating); i++)
          {
            details += `<i class="fas fa-star"></i>`;
          }
        }
        else
        {
          details += 'No Rating Yet';
        }

        details +=
        `
        </p>
        <button class="btn_submit" data-username="${user.username}">Submit for Review</button>
      `;
      $('.full_detail').append(details);
    }
    console.log(data);
  });
}
