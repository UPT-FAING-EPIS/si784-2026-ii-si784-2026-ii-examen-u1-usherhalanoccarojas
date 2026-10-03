using DeviceInventory.Api.Validators;
using FluentAssertions;
using Xunit;

namespace DeviceInventory.Tests;

public class ImeiValidatorTests
{
    [Theory]
    [InlineData("359247118234503", true)] // Luhn valid
    [InlineData("867123456789017", true)] // Luhn valid
    [InlineData("357891234567890", true)] // Luhn valid
    [InlineData("359247118234502", false)] // Invalid checksum
    [InlineData("12345", false)] // Too short
    [InlineData("35924711823450199", false)] // Too long
    [InlineData("35924711823450A", false)] // Non-digit
    [InlineData("", false)] // Empty
    [InlineData(null, false)] // Null
    public void IsValid_ShouldValidateImeiFormatAndLuhn(string? imei, bool expected)
    {
        var result = ImeiValidator.IsValid(imei);
        result.Should().Be(expected);
    }
}
