
#include <stdio.h>

int main(int argc, char *argv[])
{
    char *str = argv[1];
    int sum = 0;
    while (*str != '\0')
    {
        sum += *str - '0';
        str++;
    }
    printf("%d", sum);
    
    return 0;
}