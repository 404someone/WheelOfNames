export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header:"eyJmaWQiOjI2ODQzOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxODA4RUUzMjBlREY2NGMwMTlBNmJiMEY3RTRiRkIzZDYyRjA2RWMifQ",
      payload: "eyJkb21haW4iOiJ3aGVlbC1uYW1lcy52ZXJjZWwuYXBwIn0",
      signature:"MHhkOTM4NjUyOGZmMTg4ZWRjNzU0ZDBhMTQ0MWJiNTJhYjkxMzU1ZjI5NDZlNzYwMTc4ZDBiOGVhNDExNmQ3Yzc5MDNjZjhlZWRiMDM0ZjhlOWVmOGJlODNjYzQwZWQ4Y2YyYTU4YzEyZTIzNTYwNmM5YTA4OTYxZWZmNjkwYTI1ZjFj",
    },
    frame: {
      version: "1",
      name: "Wheel of Names",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl:  `${appUrl}/cover.png`,  
      buttonTitle: "wheelOfNames",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#8660cc",
      // webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
