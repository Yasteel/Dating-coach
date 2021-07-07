var users, user_type, reviews, tmp_reviews, changes;

$(document).on('click','.nav_btn', function()
{
  var index = $(this).attr('data-index');

  if(index == 0 || index == "0")
  {
    user_type = 1;
    get_users();
  }
  else if(index == 1 || index == "1")
  {
    user_type = 2;
    get_users();
  }
  else if(index == 2 || index == "2")
  {
    user_type = 0;
    get_reviews();
  }
});

$(document).on('click','.btn_show_content', function()
{
  var index = parseInt($(this).attr('data-index'));
  var collapsed = parseInt($(this).attr('data-collapsed'));
  $('.btn_show_content').html('View Info <i class="fas fa-plus"></i>');
  $('.btn_show_content').attr('data-collapsed', '1');

  if(collapsed == 1) //collapsed - need to open
  {
    $(this).html('Hide Info <i class="fas fa-minus"></i>');
    get_user_info(index);
    $(this).attr('data-collapsed', '0');
  }
  if(collapsed == 0)//Opened - need to collapse
  {
    $(this).html('View Info <i class="fas fa-plus"></i>');
    $('.rest').remove();
    $(this).attr('data-collapsed', '1');
  }

});

$(document).on('click','.btn_save_user_info', function()
{
  var index = parseInt($(this).attr('data-index'));
  var username = users[index].username;
  if(user_type == 1)
  {
    console.log(username);
    var description = $('#description').val();
    var likes = get_values('likes');
    var dislikes = get_values('dislikes');
    var qualities = get_values('qualities');
    var partner = get_values('partner');;

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
        console.log(data);
        show_alert('Update Successful', 0);
        get_users();
      }
      else
      {
        console.log('Something went wrong: ', data);
      }
    });
  }
  else if(user_type == 2)
  {
    var first_name = $('.first_name')[index].value;
    var surname = $('.surname')[index].value;
    var age = $('.age')[index].value;
    var description = $('#description').val();

    $.post('php/coachDashboard.php',
    {
      operation: 'update',
      username: username,
      name: first_name,
      surname: surname,
      age: age,
      description: description
    },
    function(data)
    {
      if(data == 1)
      {
        get_users();
        // get_user_info(index);
        show_alert('Updated Coach Information Successful', 0);
      }
      else
      {
        console.log("Error", data);
      }
    });
  }
});

$(document).on('click','.btn_save_list', function()
{
  if(JSON.stringify(tmp_reviews) == JSON.stringify(reviews))
  {
    show_alert('No Changes Were Made');
  }
  else
  {
    changes = [];
    for(i=0; i<reviews.length; i++)
    {
      if(reviews[i].description != tmp_reviews[i].description)
      {
        changes.push(tmp_reviews[i]);
      }
    }
    console.log(changes);
    if(changes.length > 0)
    {
      $.post('php/admin.php',
      {
        operation: 'update_reviews',
        updates: changes
      },
      function(data)
      {
        if(data == 0)
        {
          show_alert('Update Successful', 0);
        }
        else if(data == 1)
        {
          show_alert('Something went wrong', 1);
        }
      });
    }
  }
});

$(document).on('keyup','.review_description', function()
{
  var text = $(this).val();
  var index = parseInt($(this).closest('table').attr('data-index'));
  tmp_reviews[index].description = text;
});

/*============Get Data From User Table==========================*/
function get_users()
{
  $.post('php/admin.php',
  {
    operation: 'get_users',
    user_type: user_type
  },
  function(data)
  {
    if(data == 1)
    {
      show_alert('no users found');
    }
    else
    {
      users = JSON.parse(data);

      $('.container').html('');
      $.each(users, function(i,v)
      {
        var append = '';
        append +=
        `
        <div class="content_wrapper _${i}">
          <div id="${v.username}" class="main_info">
            <input type="text" class="username" value="${v.username}" disabled>
            <input type="text" class="first_name" value="${v.first_name}">
            <input type="text" class="surname" value="${v.surname}">
            <input type="text" class="age" value="${v.age}">
            <input type="text" class="gender" value="${v.gender}" disabled>
            <button type="button" class="btn_show_content" data-index="${i}" data-collapsed="1">View Info <i class="fas fa-plus"></i></button>
          </div>
        <div>
        `;
        $('.container').append(append);
      })
    }
  });
}
/*============Get Data From User Table==========================*/
function get_user_info(index)
{
  var client_username = users[index].username;
  var append =
  `
  <div class="rest">
    <div class="header">
      <h3>Description</h3>
    </div>
    <div class="body">
      <textarea id="description">${users[index].description}</textarea>
    </div>
  `;
  if(user_type == 1)
  {
    console.log('fuck');
    $.post('php/admin.php',
    {
      operation: 'get_user_info',
      username: client_username
    },
    function(data)
    {
      var likes =
      `
      <div class="header">
        <h3>Likes</h3>
      </div>
      <div class="body">
      `;

      var dislikes =
      `
      <div class="header">
        <h3>Dislikes</h3>
      </div>
      <div class="body">
      `;

      var qualities =
      `
      <div class="header">
        <h3>My Qualities</h3>
      </div>
      <div class="body">
      `;

      var partner =
      `
      <div class="header">
        <h3>Partner Qualities</h3>
      </div>
      <div class="body">
      `;

        $.each(data[0], function(i,v)
        {
          if(v.type == 1)
          {
            likes += `<input type="text" class="likes" value="${v.description}">`;
          }
          else if(v.type == 0)
          {
            dislikes += `<input type="text" class="dislikes" value="${v.description}">`;
          }
        });
        $.each(data[1], function(i,v)
        {
          if(v.type == 1)
          {
            qualities += `<input type="text" class="qualities" value="${v.description}">`;
          }
          else if(v.type == 0)
          {
            partner += `<input type="text" class="partner" value="${v.description}">`;
          }
        });

        likes += ` </div>`;
        dislikes += ` </div>`;
        qualities += ` </div>`;
        partner += ` </div>`;

        append = append + likes + dislikes + qualities + partner;

        append +=
        `
            <div class="header">
              <button class="btn_save_user_info" data-index="${index}">Save Changes</button>
            </div>
          </div>
        `;

        $(`.rest`).remove();
        $(`.content_wrapper._${index}`).append(append);

    },'json');

  }
  else if(user_type == 2)
  {
    append +=
    `
        <div class="header">
          <button class="btn_save_user_info" data-index="${index}">Save Changes</button>
        </div>
      </div>
    `;
    $(`.rest`).html('');
    $(`.content_wrapper._${index}`).append(append);
  }

}

function get_reviews()
{
  $.post('php/admin.php',
  {
    operation: 'fetch_reviews'
  },function(data)
  {
    if(data == 1)
    {
      alert('No records Found');
    }
    else
    {
      reviews = JSON.parse(data);
      tmp_reviews = JSON.parse(data);
    }
    display_reviews();
  });
}

function display_reviews()
{
  $('.container').html('');
  var append = "";
  if(reviews.length == 0)
  {
    append =
    `
      <div class="no_records_found :(">
        <h2>No Records Found</h2>
      </div>
    `;
  }
  else
  {
    append =
    `
    <div class="review_list">
      <thead>
        <table>
          <tr>
            <th>Coach</th>
            <th>Comments</th>
            <th>Profile Rating</th>
            <th>Client</th>
          </tr>
        </table>
      </thead>
      <tbody>
    `;
    $.each(reviews, function(i,v)
    {
      append +=
      `
      <table data-index="${i}" data-job-id="${v.job_id}">
        <tr>
          <td>${v.coach}</td>
          <td><textarea class="review_description">${v.description}</textarea></td>
          <td>${v.rating}</td>
          <td>${v.client}</td>
        </tr>
      </table>
      `;
    });
////////////////////////ADD HIDE///////////////////////////////////////////////////////
    append +=
    `
      </tbody>
      <div class="saveList">
        <button class="btn_save_list">Save</button>
      </div>
    </div>
    `;
  }

  $('.container').append(append);

}
