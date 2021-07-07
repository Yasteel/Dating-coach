<?php

  include 'connection.php';

  if($_REQUEST['operation'] == 'fetch_my_jobs')
  {
    $username = $_REQUEST['username'];
    $sql =
    "SELECT A.id, A.reviewer, A.status, B.first_name, B.surname, B.profile_picture
     FROM jobs A
     INNER JOIN users B
     on A.reviewer = b.username
     WHERE A.dater = '$username';
    ";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)
        {
          $my_jobs = array();

          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            array_push($my_jobs, $row);
          }
          echo json_encode($my_jobs);
        }else
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


  if($_REQUEST['operation'] == 'load_review')
  {
    $job_id = $_REQUEST['job_id'];

    $sql = "SELECT description, rating, rated FROM reviews WHERE job_id = '$job_id';";
    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)
        {
          $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
          echo json_encode($row);
        }
        else
        {
          echo 2;
        }
      }
      else
      {
        echo 1;
      }
    }
    else echo 1;


  }

  if($_REQUEST['operation'] == 'rate_feedback')
  {
    $job_id = $_REQUEST['job_id'];
    $rating = $_REQUEST['rating'];

    $sql = "SELECT reviewer FROM jobs WHERE id='$job_id';";
    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);

      if(mysqli_num_rows($result) == 1)
      {
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
        $coach_id = $row['reviewer'];

        $sql = "SELECT rating FROM ratings WHERE username='$coach_id';";
        $statement = mysqli_prepare($conn, $sql);
        if(mysqli_stmt_execute($statement))
        {
          $result = mysqli_stmt_get_result($statement);
          $sql = "";
          if(mysqli_num_rows($result) == 1)
          {
            $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
            $previous_rating = $row['rating'];

            if($previous_rating == 0)
            {
              $new_rating = $rating;
            }
            else
            {
              $new_rating = floor(($previous_rating+$rating) / 2);
            }

            $sql = "UPDATE ratings SET rating=$new_rating WHERE username='$coach_id';";

            $statement = mysqli_prepare($conn, $sql);
            if(mysqli_stmt_execute($statement))
            {
              $sql = "UPDATE reviews SET rated=true WHERE job_id='$job_id';";
              $statement = mysqli_prepare($conn, $sql);
              if(mysqli_stmt_execute($statement))
              {
                echo 0;
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
