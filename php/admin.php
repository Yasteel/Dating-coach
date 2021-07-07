<?php

  include 'connection.php';

  if($_REQUEST['operation'] == 'get_users')
  {
    $user_type = $_REQUEST['user_type'];

    $sql =
    "SELECT A.username, A.first_name, A.surname, A.gender, A.age, A.description
     FROM users A
     INNER JOIN login B
     ON A.username = B.username
     WHERE B.user_type = $user_type;
     ";

     $statement = mysqli_prepare($conn, $sql);

     if(mysqli_stmt_execute($statement))
     {
       $result = mysqli_stmt_get_result($statement);

       if(mysqli_num_rows($result) > 0)
       {
         $users = array();

         while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
         {
           array_push($users, $row);
         }
         echo json_encode($users);
       }
       else
       {
         echo 1;
       }
     }
  }

  if($_REQUEST['operation'] == 'get_user_info')
  {
    $username = $_REQUEST['username'];
    $allData = array();
    $sql = "SELECT description, type FROM likes WHERE username = '$username';";
    $statement = mysqli_prepare($conn, $sql);

    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);

      if(mysqli_num_rows($result) > 0)
      {
        $likes = array();
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
        {
          array_push($likes, $row);
        }
        array_push($allData, $likes);
      }

      $sql = "SELECT description, type FROM qualities WHERE username = '$username';";
      $statement = mysqli_prepare($conn, $sql);

      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)
        {
          $qualities = array();

          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            array_push($qualities, $row);
          }
          array_push($allData, $qualities);
        }
        echo json_encode($allData);
      }
    }
  }

  if($_REQUEST['operation'] == 'fetch_reviews')
  {
    $sql =
    "SELECT A.job_id, A.description, A.rating, B.reviewer coach, B.dater client
     FROM reviews A
     INNER JOIN jobs B
     ON A.job_id = B.id;
    ";

    $statement = mysqli_prepare($conn, $sql);

    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);

      if(mysqli_num_rows($result) > 0)
      {
        $reviews = array();
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
        {
          array_push($reviews, $row);
        }
        echo json_encode($reviews);
      }
      else
      {
        echo 1;
      }
    }
  }

  if($_REQUEST['operation'] == 'update_reviews')
  {
    $updates = $_REQUEST['updates'];
    $success = true;

    foreach($updates as $review)
    {
      $description = $review['description'];
      $job_id = $review['job_id'];

      $sql = "UPDATE reviews SET description='$description' WHERE job_id=$job_id;";
      $statement = mysqli_prepare($conn, $sql);
      if(!mysqli_stmt_execute($statement))
      {
        $success = false;
      }
    }

    if($success)
    {
      echo 0;
    }
    else
    {
      echo 1;
    }
  }
