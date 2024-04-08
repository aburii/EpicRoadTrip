export interface PlacesDetailsRes {
  html_attributions: any[];
  next_page_token: string;
  result: Result[];
  status: string;
}

interface Result {
  website?: string;
  formatted_address?: string;
  international_phone_number?: string;
}
