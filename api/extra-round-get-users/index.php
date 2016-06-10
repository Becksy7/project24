<?php
$answer = array(
	"users" => array(
		array(
			"id" => 123,
			"image" => "/path/to/user/image.jpg",
			"name" => "Иван Иваныч",
			"guessedTraits" => array(
				"correct" => array(1, 2, 6),
				"incorrect" => array(0, 5))
		),
		array(
			"id" => 123,
			"image" => "/path/to/user/image.jpg",
			"name" => "Константин Константинопольский"),
		array(
			"id" => 123,
			"image" => "/path/to/user/image.jpg",
			"name" => "Константин Константинопольский")
	)
);
$answer = array(
	"error"=>true,
	"message"=> "Произошла ошибка"
);
echo json_encode($answer);