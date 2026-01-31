<?php
$conn = new mysqli("localhost","root","","kuralthozhan_db");
if($conn->connect_error){ die("DB Error"); }

$mobile = $_POST['mobile'];
$password = $_POST['password'];

$res = $conn->query("SELECT * FROM users WHERE mobile='$mobile'");
if($res->num_rows==1){
  $u=$res->fetch_assoc();
  if(password_verify($password,$u['password'])){
    $conn->query("INSERT INTO login_logs (user_id) VALUES ({$u['id']})");
    echo "success";
    exit;
  }
}
echo "invalid";
?>
