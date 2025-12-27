export async function GET() {
  try {
    return Response.json({
      message: 'It works.',
    });
  } catch (error) {
    console.log(error);
  }
}