<?php
error_reporting(0);

header('Content-type: application/json');

$answer = array(
	"users" => array(
		array(
			"id" => 123,
			"image" => "photo_1.jpg",
			"name" => "Иван Иваныч",
			"guessedTraits" => array(
				"correct" => array(1, 2, 6),
				"incorrect" => array(0, 5)
			)
		),
		array(
			"id" => 124,
			"image" => "photo_1.jpg",
			"name" => "Константин Константинопольский"),
		array(
			"id" => 125,
			"image" => "photo_1.jpg",
			"name" => "Мария Петровна Петрова")
	)
);
//$answer = array(
//	"error"=>true,
//	"message"=> "Произошла ошибка"
//);
//$answer = array("noUsersAnymore" => true);

echo json_encode($answer);