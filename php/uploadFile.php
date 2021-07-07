<?php
  require_once 'connection.php';

  $username = $_POST['username'];
  $operation = $_POST['operation'];
  $targetDir = "../upload/";
  $fileName = basename($_FILES["file"]["name"]);

  $targetFilePath = $targetDir.$fileName;
  $fileType = pathinfo($targetFilePath,PATHINFO_EXTENSION);

  $allowTypes = array('jpg','png','jpeg','gif');
  if(in_array($fileType, $allowTypes))
  {
    // Upload file to server
    if(move_uploaded_file($_FILES["file"]["tmp_name"],$targetFilePath))
    {

      if($operation == 'updateProfile')
      {
        $sql = "UPDATE users SET profile_picture='$fileName' WHERE username='$username';";

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
      else if($operation == 'addPicture')
      {
        $sql = "INSERT INTO gallery (username, image) VALUES ('$username', '$fileName');";
        $statement = mysqli_prepare($conn, $sql);
        if(mysqli_stmt_execute($statement))
        {
          echo 0; //Success
        }
        else
        {
          echo 1;
        }

      }
    }
  }
 ?>
