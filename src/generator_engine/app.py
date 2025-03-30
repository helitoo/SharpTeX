from fastapi import FastAPI, Request
import process

app = FastAPI()

@app.post("/generate")
async def generate(request: Request):
    body = await request.body()
    body_str = body.decode("utf-8") # Decode byte to string
    return process.main(body_str)
