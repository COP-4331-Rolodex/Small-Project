<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

    error_reporting(E_ALL); // reports all errors
    ini_set("display_errors", "1"); // shows all errors
    ini_set("log_errors", 1);
    ini_set("error_log", "/tmp/php-error.log");

        $inData = getRequestInfo();

        $searchResults = "";
        $searchCount = 0;

    $servername = "localhost";
    $username = "dev";
    $password = "knights";
    $database = "Contacts";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
        //$id = 1;

            $stmt = $conn->prepare("SELECT * from contacts where owner_id=?");

            $stmt->bind_param("i", $inData["id"]);
            //$stmt->bind_param("i", $id);

            $stmt->execute();

                $result = $stmt->get_result();

                $searchResults = array();

                while($row = $result->fetch_assoc())
                {
                        $searchResults[$searchCount] = $row["first_name"]. ' ' . $row["last_name"]. ' ' . $row["email"] . ' '. $row["phone"] . ' ' . $row["id"];
                        $searchCount++;
                }

                $stmt->close();
                $conn->close();

                if( $searchCount == 0 )
                {
                        returnWithError( "No Records Found" );
                }
                else
                {
                        sendResultInfoAsJson( $searchResults );
                }

        }

        function getRequestInfo()
        {
                return json_decode(file_get_contents('php://input'), true);
        }

        function sendResultInfoAsJson( $obj )
        {
                header('Content-type: application/json');
                $length = count($obj);
                for ($i = 0; $i < $length; $i++) {
                        echo $obj[$i];
                        echo "\r\n";
                }
                //var_dump($obj);

        }

        function returnWithError( $err )
        {
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

?>
