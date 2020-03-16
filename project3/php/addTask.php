<?php
    $userName = "root";
    $password = "";
    $dbName = "ToDo";
    $server = "127.0.0.1";


    $db = new mysqli($server, $userName, $password, $dbName);

    $sql = "insert into tasks(description, complete) values(?, ?)";

    $stmt = $db->prepare($sql);

    $defaultComplete = false;
    $stmt->bind_param("si", $_REQUEST["description"], $defaultComplete);

    $stmt->execute();
    $newId = $db->insert_id;
    $db->close();

    $db = new mysqli($server, $userName, $password, $dbName);
    $sql = "select * from tasks where id=?";
    $selectTaskStmt = $db->prepare($sql);

    $selectTaskStmt->bind_param("i", $newId);
    $selectTaskStmt->bind_result($id, $desc, $complete, $timestamp);
    $selectTaskStmt->execute();
    $selectTaskStmt->fetch();

    $task = array("id" =>$newId, "description"=>$_REQUEST["description"],
                  "complete"=>$complete, "created"=>$timestamp);


    echo json_encode($task);


?>
