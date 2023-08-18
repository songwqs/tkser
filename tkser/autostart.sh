#!/bin/bash
screen_name="udp2raw"
screen -dmS $screen_name
cmd=$"sh /root/udp2raw.sh";
screen -x -S $screen_name -p 0 -X stuff "$cmd"
screen -x -S $screen_name -p 0 -X stuff $'\n'
screen -x -S $screen_name -p 0 -X stuff "exit"