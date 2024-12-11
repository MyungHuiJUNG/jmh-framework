#!/bin/bash

#Find the Process ID for syncapp running instance

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

cd "$SERVER_HOME"

source config/environment.properties

# Check JAVA
if [[ ! -f $JAVA ]]; then
    echo "[ERROR] $JAVA file not exist..."
    exit 1
fi

# Set Environment Variables
SERVER_ARTIFACT_ID=$ARTIFACT_ID
SERVER_JAR=$JAR_FILE_NAME.jar
SERVER_JAR_PATH=$SERVER_HOME/$SERVER_JAR
SERVER_LOG_HOME=$LOG_HOME
SERVER_TEMP_PATH=$SERVER_HOME/temp
SERVER_GCLOG_PATH=$LOG_HOME/gclogs
SERVER_HEAPLOG_PATH=$LOG_HOME/heap
SERVER_LOG_FILE_NAME=$LOG_FILE_NAME

# Check jar file
if [[ ! -f $SERVER_JAR_PATH ]]; then
    echo "[ERROR] $SERVER_HOME/$SERVER_JAR file not exist..."
    exit 0
fi

echo
echo "---------------------------------------------------------------------"
echo " Server Home = $SERVER_HOME"
echo " Server Jar = $SERVER_JAR"
echo " Server Log Home = $SERVER_LOG_HOME"
echo " Server Heap Size = $JAVA_HEAP_SIZE"
echo " Server Heap Max Size = $JAVA_HEAP_MAX_SIZE"
echo " Restart Server..."
echo "---------------------------------------------------------------------"

if [[ ! -d $SERVER_TEMP_PATH ]]; then
    mkdir -p $SERVER_TEMP_PATH
    echo "made tmp directory"
fi

if [[ ! -d $SERVER_GCLOG_PATH ]]; then
    mkdir -p $SERVER_GCLOG_PATH
    echo "made gclog directory"
fi

if [[ ! -d $SERVER_HEAPLOG_PATH ]]; then
    mkdir -p $SERVER_HEAPLOG_PATH
    echo "made heap log directory"
fi

PID=`ps -eaf | grep $SERVER_HOME/$SERVER_ARTIFACT_ID*.jar | grep -v grep | awk '{print $2}'`

if [[ "" != $SERVER_ARTIFACT_ID ]] && [[ "" !=  "$PID" ]]; then
    echo " Killing $PID"
    kill -9 $PID
else
    echo " $SERVER_ARTIFACT_ID is not running!!!"
fi

$* $JAVA -Xms$JAVA_HEAP_SIZE -Xmx$JAVA_HEAP_MAX_SIZE -verbose:gc -Xlog:gc*:file=$SERVER_GCLOG_PATH/gc.log:tags,time,uptime,level:filecount=100,filesize=1M -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=$SERVER_HEAPLOG_PATH/ -Dfile.encoding="UTF-8" -Dspring.profiles.active="$PROFILE_NAME" -Dlog.home=$SERVER_LOG_HOME -Dlog.file.name=$SERVER_LOG_FILE_NAME -Djava.io.tmpdir=$SERVER_TEMP_PATH -jar $SERVER_JAR_PATH > /dev/null 2>&1 &
echo " $SERVER_ARTIFACT_ID start..."

PID=`ps -ef | grep -v grep | grep $SERVER_JAR | grep java`
if [[ -n ${PID} ]]; then
    echo " $SERVER_ARTIFACT_ID started successfully!!!"
else
    echo " $SERVER_ARTIFACT_ID did not start!!!"
fi

echo "---------------------------------------------------------------------"
echo

exit 0
