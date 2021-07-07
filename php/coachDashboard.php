<?php
  include 'connection.php';

  if($_REQUEST['operation'] == 'fetchData')
  {
    $username = $_REQUEST['username'];

    $sql =
    "SELECT A.first_name, A.surname, A.gender, A.age, A.description, A.profile_picture, B.rating
     FROM users A
     INNER JOIN ratings B
     ON A.username = B.username
     WHERE A.username = '$username';";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) == 1)  // If a user was found
        {
          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            echo json_encode($row);
          }
        }
        else
        {
          echo 2; // If no user was found
        }
      }
    }
  }

  if($_REQUEST['operation'] == 'update')
  {
    $username =  $_REQUEST['username'];
    $name =  $_REQUEST['name'];
    $surname =  $_REQUEST['surname'];
    $age =  $_REQUEST['age'];
    $description =  $_REQUEST['description'];

    $sql = "UPDATE users SET first_name='$name', surname='$surname', age=$age, description='$description' WHERE username='$username';";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        echo 1;
      }
      else
      {
        echo 2;
      }
    }
    else
    {
      echo 2;
    }
  }
