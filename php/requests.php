<?php
  include 'connection.php';

  if($_REQUEST['operation'] == 'fetchJobs')
  {
    $username = $_REQUEST['username'];
    $jobList = array();
    $sql ="SELECT A.username,
                  A.first_name,
                  A.surname,
                  A.gender,
                  A.age,
                  A.description,
                  A.profile_picture,
                  C.description likes,
                  C.type ltype,
                  D.description qualities,
                  D.type qtype
           FROM 	users A
           INNER JOIN
           (
             SELECT dater, status FROM jobs WHERE reviewer = '$username'
           )B
           ON A.username = B.dater
           INNER JOIN
           likes C
           ON B.dater = C.username
           INNER JOIN
           qualities D
           ON B.dater = D.username
           WHERE B.status = 0;";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)  // If a user was found
        {
          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            $obj = (object)[
              'username'=>$row['username'],
              'first_name'=>$row['first_name'],
              'surname'=>$row['surname'],
              'gender'=>$row['gender'],
              'age'=>$row['age'],
              'description'=>$row['description'],
              'profile_picture'=>$row['profile_picture'],
              'likes'=>$row['likes'],
              'ltype'=>$row['ltype'],
              'qualities'=>$row['qualities'],
              'qtype'=>$row['qtype']
            ];
            array_push($jobList,$obj);
          }
          echo json_encode($jobList);
        }
        else
        {
          echo 1; // If no user was found
        }
      }
    }
  }


  if($_REQUEST['operation'] == 'fetchGallery')
  {
    $client = $_REQUEST['username'];

    $sql = "SELECT image FROM gallery WHERE username = '$client';";
    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);
        if(mysqli_num_rows($result) > 0)  // If a user was found
        {
          $photos = array();
          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            array_push($photos, $row);
          }
          echo json_encode($photos);
        }
        else
        {
          echo 0;
        }
      }
      else
      {
        echo 0;
      }
    }
    else
    {
      echo 0;
    }

  }



  if($_REQUEST['operation'] == 'submitReview')
  {
    $client_username = $_REQUEST['client_username'];
    $coach_username = $_REQUEST['coach_username'];
    $review_description = $_REQUEST['review_description'];
    $rating = $_REQUEST['rating'];
    $job_id = "";

    $sql = "SELECT id FROM jobs WHERE dater='$client_username' AND reviewer='$coach_username';";
    $statement = mysqli_prepare($conn, $sql);

    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);
      if(mysqli_num_rows($result) > 0)
      {
        while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
        {
          $job_id = $row['id'];
        }

        $sql = "INSERT INTO reviews (job_id, description, rating) VALUES ($job_id, '$review_description', $rating);";
        $statement = mysqli_prepare($conn, $sql);
        if(mysqli_stmt_execute($statement))
        {
          $sql = "UPDATE jobs SET status=1 WHERE id = $job_id;";
          $statement = mysqli_prepare($conn, $sql);
          if(mysqli_stmt_execute($statement))
          {
            echo 0; //success
          }
          else
          {
            echo 1;
          }
        }
        else
        {
          echo 1;
        }

      }
      else
      {
        echo 1;
      }
    }
  }

 ?>
