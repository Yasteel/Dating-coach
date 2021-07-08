<?php
  include 'connection.php';

  if($_REQUEST['operation'] == 'check_for_reviews')
  {
    $username = $_REQUEST['username'];

    $sql = "SELECT id FROM	jobs WHERE jobs.status = 0 AND dater = '$username';";
    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);
      if(mysqli_num_rows($result) > 0)
      {
        echo 0;
      }
      else
      {
        echo 1;
      }
    }
  }
 ?>
