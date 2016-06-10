<?php
$answer = array(
  "success" => true,
  "correctTraitIds" => [2,3],
  "incorrectTraitIds" => [6],
  "userScore"=> 42
);
echo json_encode($answer);