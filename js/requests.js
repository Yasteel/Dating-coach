var username, userType, rating = 1;
var jobs  = [];


$(document).ready(function()
{
  username = sessionStorage.getItem('username',username);
  userType = sessionStorage.getItem('userType',userType);

  if(!username)
  {
    console.log(username);
    window.location.href = "index.html";
  }
  else if(userType == 1 || userType == "1")
  {
    console.log(username);
    window.location.href = "index.html";
  }

  fetchJobs();
});

$(document).on('click', '.btn_tab', function()
{
  var id = $(this).attr('id');

  $('.btn').removeClass('current');
  $(this).addClass('current');

  $('.tab').addClass('hide');
  $(`.${id}`).removeClass('hide');
});

$(document).on('click', '.request', function()
{
  $('.request').removeClass('selected');
  $(this).addClass('selected');


  var client_username = $(this).attr('id');
  displayInfo(client_username);
  displayForm(client_username);
  fetchGallery(client_username);
});

$(document).on('click', '.photo img', function()
{
  window.open($(this).attr('src'), "_blank");
});

$(document).on('click', '.btn_review', function()
{
  var review_description = $('.review_description').val();

  var client_username = $(this).attr('data-client-id');
  console.log(client_username,username);

  if(review_description.length < 1)
  {
    show_alert('Enter a description', 1);
  }
  else
  {
    $.post('php/requests.php',
    {
      operation: 'submitReview',
      client_username: client_username,
      coach_username: username,
      review_description: review_description,
      rating: rating
    },
    function(data)
    {
      if(data == 0)
      {
        fetchJobs();
        show_alert('Profile Reviewed', 0);
      }
    });
  }

});

$(document).on('click', '.fas.fa-star', function()
{
  $(document).off('mouseleave', '.fas.fa-star');
});

$(document).on('mouseenter', '.fas.fa-star', function()
{
  $('.fas.fa-star').css('color', 'var(--l_white)');

  var index = parseInt($(this).attr('data-index'));
  var stars = document.getElementsByClassName('fa-star');

  if(index < 1)
  {
    $(this).css('color', 'var(--base)');
  }
  else
  {
    index++;
    rating = index;
    console.log(rating);
    for(i=0; i<index; i++)
    {
      stars[i].style.color = 'var(--base)';
    }
  }

});

$(document).on('mouseleave', '.fas.fa-star', function()
{
  $('.fas.fa-star').css('color', 'var(--l_white)');
});

$(document).on('keyup', '.review_description', function()
{
  let length = 150 - ($('.review_description').val().length);
  $('.char_count').html(`${length} characters left`);
})

function fetchJobs()
{
  jobs = [];
  $.post('php/requests.php',
  {
    operation: 'fetchJobs',
    username: username
  },
  function(data)
  {
    if(data == 1)
    {
      jobs.push('error');
    }
    else
    {
      var list = JSON.parse(data);
      var usernames = [];
      $.each(list,function(i,v)
      {
        if($.inArray(v.username,usernames) < 0)
        {
          usernames.push(v.username);
        }
      });

      $.each(usernames,function(i1,v1)
      {
        var likes = [];
        var dislikes = [];
        var my_qualities = [];
        var partner_qualities = [];
        // TODO: make gallery array
        var obj = {username: v1};
        $.each(list,function(i2,v2)
        {
          // likes and dislikes
          if(v1 == v2.username)
          {
            obj.first_name = v2.first_name;
            obj.surname = v2.surname;
            obj.age = v2.age;
            obj.gender = v2.gender;
            obj.description = v2.description;
            obj.profile = v2.profile_picture;
            // TODO: gallery.push(v2.gallery)

            if(v2.ltype == 1)
            {
              if($.inArray(v2.likes,likes) < 0)
              {
                likes.push(v2.likes);
              }
            }
            else if (v2.ltype == 0)
            {
              if($.inArray(v2.likes,dislikes) < 0)
              {
                dislikes.push(v2.likes);
              }
            }
            // Qualities
            if(v2.qtype == 1)
            {
              if($.inArray(v2.qualities,my_qualities) < 0)
              {
                my_qualities.push(v2.qualities);
              }
            }
            else if (v2.qtype == 0)
            {
              if($.inArray(v2.qualities,partner_qualities) < 0)
              {
                partner_qualities.push(v2.qualities);
              }
            }
          }
        });
        obj.likes = likes;
        obj.dislikes = dislikes;
        obj.my_qualities = my_qualities;
        obj.partner_qualities = partner_qualities;
        // TODO: obj.gallery = gallery
        jobs.push(obj);
      });

      console.log(jobs);
    }

    clearTabs();
    displayList();
  });
}

function displayList()
{
  $('.list').html('');
  var append = '';

  if(jobs[0] == 'error')
  {
    append +=
    `
      <div class="nothing_to_show"><h2>No Review Requests To Show</h2></div>
    `;
  }
  else
  {
    $.each(jobs, function(i,v)
    {
      append +=
      `
      <div class="request" id="${v.username}">
        <div class="profile_picture">
          <img src="upload/${v.profile}" alt="Profile Picture for ${v.first_name} ${v.surname}">
        </div>
        <div class="short_detail">
          <p class="name">${v.first_name} ${v.surname}</p>
          <p>${v.gender}, ${v.age}</p>
        </div>
      </div>
      `;
    });
  }

  $('.list').append(append);
}

function displayInfo(id)
{
  var selectedRequest
  $.each(jobs, function(i,v)
  {
    if(v.username == id)
    {
      selectedRequest = jobs[i];
      return;
    }
  });

  var append =
  `
  <div class="info">
    <div>
      <p>${selectedRequest.description}</p>
    </div>
    <div>
      <p><span class="highlight">Likes: </span> ${selectedRequest.likes}</p>
      <p><span class="highlight">Dislikes: </span> ${selectedRequest.dislikes}</p>
    </div>
    <div>
      <p><span class="highlight">Self Qualities: </span> ${selectedRequest.my_qualities}</p>
    </div>
    <div>
      <p><span class="highlight">Partner Qualities: </span> ${selectedRequest.partner_qualities}</p>
    </div>
  </div>
  `;

  $('.info_container').html('');
  $('.info_container').append(append);

}

function displayForm(id)
{
  $('.review').html('');

  var append =
  `
  <div class="comments">
    <p>Leave a comment for the client</p>
    <textarea class="review_description" maxlength="150"></textarea>
    <p class="char_count">150 characters left</p>
  </div>
  <div class="rating">
    <p>Leave a rating on their profile</p>
    <div class="stars">
      <i class="fas fa-star" data-index="0"></i>
      <i class="fas fa-star" data-index="1"></i>
      <i class="fas fa-star" data-index="2"></i>
      <i class="fas fa-star" data-index="3"></i>
      <i class="fas fa-star" data-index="4"></i>
    </div>
  </div>
  <button class="btn_review" data-client-id="${id}">Submit Review</button>
  `;
  $('.review').append(append);
}

function fetchGallery(id)
{
  $.post('php/requests.php',
  {
    operation: 'fetchGallery',
    username: id
  },
  function(data)
  {
    var append = "";
    if(data == 0)
    {
      $('.photo_uploads').html('');
      append = `<div class="nothing_to_show"><h2>Nothing to show</h2></div>`;
      $('.photo_uploads').append(append);
    }
    else
    {
      var gallery = JSON.parse(data);


      $.each(gallery, function(i,v)
      {
        append +=
        `
          <div class="photo"><img src="upload/${v.image}" class="photo_uploads" alt="user image" title="Open Image"></div>
        `;
      });

      $('.photo_uploads').html('');
      $('.photo_uploads').append(append);
    }
  });
}

function clearTabs()
{
  $('.info_container').html('');
  $('.photo_uploads').html('');
  $('.review').html('');
}
