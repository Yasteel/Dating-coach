var username, userType, job_id;

$(document).ready(function()
{
  username = sessionStorage.getItem('username');
  userType = sessionStorage.getItem('userType');

  fetch_my_jobs();
});

$(document).on('click', '.coach', function()
{
  job_id = $(this).attr('data-job-id');
  loadReview(job_id);

  $('.coach').removeClass('selected');
  $(this).addClass('selected');
});

$(document).on('click', '.rate_star', function()
{
  $(document).off('mouseleave', '.rate_star');
  var rating = parseInt($(this).attr('data-index')) + 1;

  $.post('php/feedback.php',
  {
    operation: 'rate_feedback',
    job_id: job_id,
    rating: rating
  },
  function(data)
  {
    if(data == 1)
    {
      show_alert('Error', 1);
    }
    else
    {
      $('.full_detail').html('');
      show_alert('Thank you for your feedback');
      fetch_my_jobs();
    }
  });


});

$(document).on('mouseenter', '.rate_star', function()
{
  $('.rate_star').css('color', 'var(--l_white)');

  var index = parseInt($(this).attr('data-index'));
  var stars = document.getElementsByClassName('rate_star');

  if(index < 1)
  {
    $(this).css('color', 'var(--text)');
  }
  else
  {
    index++;
    rating = index;
    console.log(rating);
    for(i=0; i<index; i++)
    {
      stars[i].style.color = 'var(--text)';
    }
  }

});

$(document).on('mouseleave', '.rate_star', function()
{
  $('.rate_star').css('color', 'var(--l_white)');
});


function fetch_my_jobs()
{
  $('.list').html('');

  $.post('php/feedback.php',
  {
    operation: 'fetch_my_jobs',
    username: username
  },
  function(data)
  {
    if(data == 1)
    {
      show_alert('You havent submitted your Profile Yet', 1);
    }
    else
    {
      var append = "";
      var jobs = JSON.parse(data);

      $.each(jobs, function(i,v)
      {

        append +=
        `
        <div class="coach" data-job-id="${v.id}">
          <div class="profile_picture">
            <img src="upload/${v.profile_picture}" alt="profile picture">
          </div>
          <div class="short_detail">
            <p class="name">${v.first_name} ${v.surname}</p>
        `;
        if(v.status == 0)
        {
          append +=
          `
          <p class="status" data-status="${v.status}">Pending...</p>
          </div>
          </div>
          `;
        }
        else
        {
          append +=
          `
          <p class="status" data-status="${v.status}">Reviewed</p>
          </div>
          </div>
          `;
        }
      });
      $('.list').append(append);
    }
  });
}

function loadReview(job_id)
{
  $('.full_detail').html('');

  $.post('php/feedback.php',
  {
    operation: 'load_review',
    job_id: job_id
  },
  function(data)
  {
    var append = "";
    if(data == 1)
    {
      show_alert('error', 1);
    }
    else if (data == 2)
    {
      append +=
      `
        <div class="pending"><h2>Coach has not Reviewed Your Profile</h2></div>
      `;
    }
    else
    {
      var review = JSON.parse(data);

      append =
      `
      <p class="description">${review.description}</p>
      <p>Your profile has been rated: </p>
      <div class="rate">
      `;

      var rating = parseInt(review.rating);
      for(i=0; i< rating; i++)
      {
        append += `<i class="fas fa-star highlight"></i>`;
      }

      for(i=0; i<(5-rating); i++)
      {
        append += `<i class="fas fa-star"></i>`;
      }
      append += `</div>`;

      if(!review.rated)
      {
        append +=
        `
        <div class="message">
          <p>If this coach gave you reliable and useful feedback,</p>
          <p>Please rate their service on a scale of 1-5</p>
          <p>Where 1 being not helpful and 5 being very helpful.</p>
          <div class="rate">
            <i class="fas fa-star rate_star" data-index="0"></i>
            <i class="fas fa-star rate_star" data-index="1"></i>
            <i class="fas fa-star rate_star" data-index="2"></i>
            <i class="fas fa-star rate_star" data-index="3"></i>
            <i class="fas fa-star rate_star" data-index="4"></i>
          </div>
        </div>
        `;
      }
    }
    $('.full_detail').append(append);
  });
}
