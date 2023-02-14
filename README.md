# coin-catalogue project
This is a simple coin catalogue project. 
Here, I have used React js as frontend, node js,express as back-end and mysql as database.
First of All, in the express js, I used the local images as link and used them in storing the links in database. 
Then made different request queries in node js,express.
Based on the page in Front side, I made request via js fetch and got the data from database and showed them...
FOr the admin panel side, if user tries to go to pages different from login page, it is checking whether user has a token or not. In case there is not a token it redirects 
the user to the login page. IN the login page, in case if the logging in(so the user and password matches) the front end receives token generated from back-end
and stores it in the local storage. It is a simple authorization. So I did not used token verification in order to render it simple. So it checks only whether
the token is present or not.

