#!/bin/bash

# Set SERVER_HOME if not already set
if [ -z $SERVER_HOME ]; then
    # Resolve links - $0 may be a softlink
    PRG=$0

    while [ -h $PRG ]; do
        ls=`ls -ld $PRG`
        link=`expr $ls : '.*-> \(.*\)$'`
        if expr $link : '/.*' > /dev/null; then
            PRG=$link
        else
            PRG=`dirname $PRG`/$link
        fi
    done

    # Get standard environment variables
    PRGDIR=`dirname $PRG`
    SERVER_HOME=`cd $PRGDIR/.. >/dev/null; pwd`
fi
echo
echo "---------------------------------------------------------------------"
echo " Server Home = $SERVER_HOME"


cd "$SERVER_HOME"

source config/environment.properties

SERVER_ARTIFACT_ID=$ARTIFACT_ID
SERVER_JAR=$JAR_FILE_NAME.jar
SERVER_JAR_PATH=$SERVER_HOME/$SERVER_JAR
SERVER_LOG_HOME=$LOG_HOME

echo " Server Jar = $SERVER_JAR"
echo " Server Log Home = $SERVER_LOG_HOME"
echo " Stop Server..."
echo "---------------------------------------------------------------------"


PID=`ps -eaf | grep $SERVER_JAR | grep -v grep | awk '{print $2}'`

if [[ "" != $SERVER_ARTIFACT_ID ]] && [[ "" !=  "$PID" ]]; then
  echo " Killing $PID"
  kill -9 $PID
else
  echo " $SERVER_ARTIFACT_ID is not running!!!"
fi
