<?php
$conn = new mysqli("localhost","root","","kuralthozhan_db");
if($conn->connect_error){ die("DB Error"); }

$name = $_POST['name'];
$mobile = $_POST['mobile'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (name,mobile,password) VALUES ('$name','$mobile','$password')";
echo $conn->query($sql) ? "success" : "error";
?>
