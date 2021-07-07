<?php
  include 'connection.php';

  $operation = $_REQUEST['operation'];

  if($operation == 'login')
  {
    $username = $_REQUEST['username'];
    $userType = $_REQUEST['userType'];
    $sql = "SELECT * FROM login WHERE username = '$username' AND user_type = '$userType';";

    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      $result = mysqli_stmt_get_result($statement);
      if(mysqli_num_rows($result) > 0)
      {
        echo 1; // If a user was found
      }
      else
      {
        echo 2; // If no user was found
      }
    }
  }

  if($operation == 'register_coach')
  {
    $username = $_REQUEST['username'];
    $name = $_REQUEST['name'];
    $surname = $_REQUEST['surname'];
    $age = $_REQUEST['age'];
    $gender = $_REQUEST['gender'];
    $description = $_REQUEST['description'];

    $sql = "INSERT INTO login VALUES('$username', 2);";
    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      $sql = "INSERT INTO users VALUES('$username', '$name', '$surname', '$gender', '$age', '$description', 'fuck');";
      $statement = mysqli_prepare($conn, $sql);

      if(mysqli_stmt_execute($statement))
      {
        $sql = "INSERT INTO ratings (username, rating) VALUES ('$username',0);";
        $statement = mysqli_prepare($conn, $sql);

        if(mysqli_stmt_execute($statement))
        {
          echo 1;
        }
        else {
          echo 3;
        }
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

  if($operation == 'register_client')
  {
    $username = $_REQUEST['username'];
    $name = $_REQUEST['name'];
    $surname = $_REQUEST['surname'];
    $age = $_REQUEST['age'];
    $gender = $_REQUEST['gender'];
    $description = $_REQUEST['description'];
    $likes = $_REQUEST['likes'];
    $dislikes = $_REQUEST['dislikes'];
    $qualities = $_REQUEST['qualities'];
    $partner = $_REQUEST['partner'];

    try
    {
      $sql = "INSERT INTO login VALUES('$username', 1);";
      $statement = mysqli_prepare($conn, $sql);
      mysqli_stmt_execute($statement);

      $sql = "INSERT INTO users VALUES('$username', '$name', '$surname', '$gender', '$age', '$description', '');";
      $statement = mysqli_prepare($conn, $sql);
      mysqli_stmt_execute($statement);

      $sql = buildSQL($username, 'likes', 'description', $likes, 1, $dislikes, 0);
      $statement = mysqli_prepare($conn, $sql);
      mysqli_stmt_execute($statement);

      $sql = buildSQL($username, 'qualities', 'description', $qualities, 1, $partner, 0);
      $statement = mysqli_prepare($conn, $sql);
      mysqli_stmt_execute($statement);

      echo 1;
    }
    catch (Exception $e)
    {
      echo $e;
    }
  }

  if($operation == 'update_profile_pic')
  {
    $username = $_REQUEST['username'];
    $fileName = $_REQUEST['fileName'];

    $sql = "UPDATE users SET profile_picture='upload/$fileName' WHERE username='$username';";
    $statement = mysqli_prepare($conn, $sql);
    if(mysqli_stmt_execute($statement))
    {
      echo 1;
    }
    else
    {
      echo 0;
    }
  }

  function buildSQL($username,  $tableName, $fieldName, $arr_1, $type_1, $arr_2, $type_2)
  {
    $sql = "INSERT INTO $tableName (username, $fieldName, type) VALUES ";
    $end = "";
    foreach($arr_1 as $value)
    {
      $end .= "('$username', '$value', $type_1),";
    }

    foreach($arr_2 as $value)
    {
      $end .= "('$username', '$value', $type_2),";
    }

    $length = strlen($end) - 1;
    $end = substr($end, 0, $length);

    $sql .= $end;

    return $sql;
  }
