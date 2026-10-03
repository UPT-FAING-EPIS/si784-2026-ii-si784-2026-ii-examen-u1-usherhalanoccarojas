using System.Text.RegularExpressions;

namespace DeviceInventory.Api.Validators;

public static class ImeiValidator
{
    private static readonly Regex NumericRegex = new(@"^\d{15}$", RegexOptions.Compiled);

    /// <summary>
    /// Validates whether a given string is a valid 15-digit IMEI number with Luhn checksum.
    /// </summary>
    public static bool IsValid(string? imei)
    {
        if (string.IsNullOrWhiteSpace(imei))
        {
            return false;
        }

        imei = imei.Trim();

        if (!NumericRegex.IsMatch(imei))
        {
            return false;
        }

        // Luhn algorithm check
        int sum = 0;
        for (int i = 0; i < 15; i++)
        {
            int digit = imei[i] - '0';

            // Double every second digit from the left (odd indexes in 0-indexed string: 1, 3, 5, 7, 9, 11, 13)
            if (i % 2 == 1)
            {
                digit *= 2;
                if (digit > 9)
                {
                    digit = (digit / 10) + (digit % 10);
                }
            }

            sum += digit;
        }

        return sum % 10 == 0;
    }
}
