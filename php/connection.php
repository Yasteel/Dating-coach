<?php

$serverName = "localhost";
$serverUserName = "root";
$serverPass = "";
$dbName = "datingcoach";

$conn = mysqli_connect($serverName,$serverUserName,$serverPass,$dbName) or die("Anything");
