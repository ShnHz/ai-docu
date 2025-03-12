docker build  -t vue:test .
docker run -p 3000:80 -e ENVIROMENT="development"  vue:test

pause

@REM http://localhost:3000/