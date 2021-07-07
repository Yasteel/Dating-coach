<?php

  include 'connection.php';
  //////////////////////////////////////////////////////////////////////////////
  if($_REQUEST['operation'] == 'fetchData')
  {
    $allData = [];

    $username = $_REQUEST['username'];

    $sql = "SELECT	A.*,
                		B.description likes,
                    B.type ltype,
                    C.description qualities,
                    C.type qtype
            FROM	  users A
                    INNER JOIN
                    likes B
            ON A.username = B.username
                    INNER JOIN
                    qualities C
            ON A.username = C.username
            WHERE A.username = '$username';";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)
        {
          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            $obj=(object)
            [
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
              'qtype'=>$row['qtype'],
            ];
            array_push($allData,$obj);
          }
        }
      }
    }
    echo json_encode($allData);
  }

  if($_REQUEST['operation'] == 'saveInfo')
  {
    $username = $_REQUEST['username'];
    $description = $_REQUEST['description'];
    $likes = $_REQUEST['likes'];
    $dislikes = $_REQUEST['dislikes'];
    $qualities = $_REQUEST['qualities'];
    $partner = $_REQUEST['partner'];

    try
    {
      $sql = "DELETE FROM likes WHERE username='$username';";
      $statement = mysqli_prepare($conn, $sql);
      mysqli_stmt_execute($statement);

      $sql = "DELETE FROM qualities WHERE username='$username';";
      $statement = mysqli_prepare($conn, $sql);
      mysqli_stmt_execute($statement);

      $sql = "UPDATE users SET description='$description' WHERE username='$username';";
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

  if($_REQUEST['operation'] == 'fetchGallery')
  {
    $username = $_REQUEST['username'];
    $sql = "SELECT image FROM gallery WHERE username = '$username';";

    if($statement = mysqli_prepare($conn, $sql))
    {
      if(mysqli_stmt_execute($statement))
      {
        $result = mysqli_stmt_get_result($statement);

        if(mysqli_num_rows($result) > 0)  // If a user was found
        {
          $arrGallery = array();
          while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
          {
            array_push($arrGallery, $row);
          }
          echo json_encode($arrGallery);
        }
        else
        {
          echo 1; // If no user was found
        }
      }
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
