<?php

  include 'connection.php';

  if($_REQUEST['operation'] == 'fetchCoaches')
  {
    $allData = array();
    $sql =
    "SELECT A.username, A.first_name, A.surname, A.gender, A.age, A.description, A.profile_picture, C.rating
     FROM users A
     INNER JOIN login B
     ON A.username = B.username
     INNER JOIN ratings C
     ON	A.username = C.username
     WHERE B.user_type = 2;";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)
        {
          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            array_push($allData,$row);
          }
          echo json_encode($allData);
        }
        else
        {
          echo 0;
        }
      }
      else
      {
        echo 1;
      }
    }
    else
    {
      echo 2;
    }
  }

  if($_REQUEST['operation'] == 'submitForRewiew')
  {
    $dater = $_REQUEST['dater'];
    $coach = $_REQUEST['coach'];
    $status = $_REQUEST['status'];

    $sql = "SELECT COUNT(id) AS job_count FROM jobs WHERE dater='$dater';";
    $statement = mysqli_prepare($conn, $sql);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);
    if(mysqli_num_rows($result) > 0)
    {
      while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
      {
        $job_count = $row['job_count'];
        break;
      }

      if($job_count > 5)
      {
        echo 0; //if user exceeds 5 reviews
      }
      else
      {
        $sql = "INSERT INTO jobs (dater, reviewer, status) VALUES ('$dater','$coach','$status');";
        $statement = mysqli_prepare($conn, $sql);
        if(mysqli_stmt_execute($statement))
        {
          echo 1; //Success
        }
      }
    }
  }

  if($_REQUEST['operation'] == 'checkSubmit')
  {
    $client_username = $_REQUEST['client_username'];
    $coach_username = $_REQUEST['coach_username'];

    $sql = "SELECT status FROM jobs WHERE dater = '$client_username' AND reviewer = '$coach_username';";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)
        {
          echo 1; //Submitted to this coach
        }
        else
        {
          echo 0; //Never Submit to this coach
        }
      }
    }
  }
