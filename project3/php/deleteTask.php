<?php
    $userName = "root";
    $password = "";
    $dbName = "ToDo";
    $server = "localhost";


    $db = new mysqli($server, $userName, $password, $dbName);

    $sql = "delete from tasks where id = ?";

    $stmt = $db->prepare($sql);

    $stmt->bind_param("i", $_REQUEST["id"]);

    $stmt->execute();

    $returnVal = $stmt->affected_rows;
    $stmt->close();
    $db->close();
    echo $returnVal;

?>
