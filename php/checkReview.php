<?php
  include 'connection.php';

  if($_REQUEST['operation'] == 'check_for_feedback')
  {
    $username = $_REQUEST['username'];

    $sql =
    "SELECT 		 COUNT(A.id) row_count
     FROM		     jobs A
     INNER JOIN	 reviews B
     On 			   A.id = B.job_id
     WHERE 		   A.dater='$username' AND A.status = 1 AND B.rated = 0;

    ";
    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);
      if(mysqli_num_rows($result) > 0)
      {
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
        if($row['row_count'] > 0)
        {
          echo 0;
        }
        else {
          echo 1;
        }
      }
      else
      {
        echo 1;
      }
    }
  }

  if($_REQUEST['operation'] == 'check_for_jobs')
  {
    $username = $_REQUEST['username'];

    $sql = "SELECT COUNT(id) row_count FROM jobs WHERE reviewer='$username' AND status=0;";

    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);
      if(mysqli_num_rows($result) > 0)
      {
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
        if($row['row_count'] > 0)
        {
          echo 0;
        }
        else {
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
