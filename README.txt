THE J6 PROGRAMMING LANGUAGE

1. ABOUT THIS DOCUMENT

    This document describes a programming language, "J6",
    designed for ease of implementation and simplicity of
    interface. It's intended to be used in a browser
    environment and implemented in JavaScript or Web
    Assembly, but could be used anywhere.

2. NOMENCLATURE

    J6
      J6 is short for "JASICKS". The abbreviation is derived
      from the fact that "JASICKS" is a J followed by six
      other characters.

    non-whitespace-character
      for the purposes of this document, any unicode
      character other than space (ASCII 32), tab, or
      newline.

    whitespace
      one or more spaces, tabs, or newlines

3. LANGUAGE SPEC

GENERAL CONCEPTS

COMMANDS

    J6 programs consist of a series of commands that execute
    one at a time, and generally in top-down sequence. A few
    commands can cause other commands to be skipped, or
    cause the flow of execution to jump to some other part
    of the program.

    A command consists of a short word, called the VERB,
    followed by zero or more ARGUMENTS. Each verb requires
    a specific number of arguments to follow it. Using any
    other number of arguments is an error that will cause
    the program not to run.

    For example, the INCR command increases the value of a
    numeric variable by some quantity. It takes exactly two
    arguments: the number to add and the variable to affect.
    The following example increments the variable called
    J6_SKILL_LEVEL by 1.

      INCR J6_SKILL_LEVEL 1

    The arguments following a verb must be separated by
    one or more spaces. The number of spaces is not
    significant. Typically only one space is used.

ARGUMENT SYNTAX

    A command argument may be either a PHRASE (a number, a
    word, or a longer string of text), or it may be the name
    of a variable that stands in for a value and will be
    replaced by that value when the program runs. A
    preceding $ indicates that the argument is a variable
    that should be replaced by its value at runtime. For
    example, here we increase the variable J6_SKILL_LEVEL by
    10.

      SET  X 10
      SET  J6_SKILL_LEVEL 5
      INCR J6_SKILL_LEVEL $X

    When the program runs, the argument $X will be replaced
    by the current value of X: in this case, 10.

    Note that we don't use the $ for the names of variables
    we are modifying, like the J6_SKILL_LEVEL variable in
    the example above. If we did, then the INCR command
    would become at runtime

      INCR 5 10

    In other words, we'd be telling the computer to change
    the value of the number 5, which is nonsensical.

PHRASE SYNTAX

    A PHRASE is a word, number, or group of words that
    either names a variable or represents a value that the
    program should manipulate.

    There are two types of phrases: QUOTED and UNQUOTED
    phrases.

    QUOTED PHRASES start and end with a double quote
    character (") and may contain any characters. If a
    quoted phrase is to contain a double quote, the double
    quote character must be doubled to avoid ambiguity
    (otherwise, it could be misinterpreted as the end of the
    phrase).

      "HELLO! THIS IS DOG"
      "I AM ON THE ""PHONE""!"

    UNQUOTED PHRASES start with a non-quote character and
    may contain only letters, numbers, and the following
    symbols:

      - hyphen/minus (-)
      - underscore (_)
      - apostrophe (')
      - brackets ([ and ])
      - equals (=)
      - greater than (>)
      - less than (<)

    Quoted phrases can be used as variable names, as
    follows:

      INCR "MY VAR" $"MY OTHER VAR"

ENVIRONMENT GLOBALS

    Running J6 programs have access to several variables
    that let them interact with the outside world. These
    variables begin with the sigil "!", which is not allowed
    in user variable names. This restriction means that the
    names of global variables always refer to those globals,
    and not to user variables.

    !DISP[I], where I is between 1 and 32 inclusive,
    stores the text displayed on the screen at the Ith
    line numbered top-down. Commands can read and write this
    variable.

    !KEY stores the character represented by the last key
    typed by the user. For alphabetic characters, !KEY is
    always uppercase. The "Tab", "Backspace", and "Return"
    keys are represented by the values "TAB", "BACKSPACE",
    and "RETURN". !KEY is not writable by program commands.
    Attempts to write it crash the program.

    !SHIFT stores a value indicating if the "Shift" key was
    held during the last keypress. Possible values of !SHIFT
    are "YES" and "NO". !SHIFT is not writable by program
    commands. Attempts to write it crash the program.

    !NEWLINE stores a value containing the line-break
    character. Attempts to write it crash the program.

VALUES

    Values in J6 are Unicode strings in whatever encoding
    is convenient for the platform. Program commands may
    interpret these values as other datatypes (numbers,
    regexes, structured data) but they are still just
    strings.

    A J6 editor or compiler MAY restrict the set of
    characters allowed in programs; for instance, allowing
    only uppercase ASCII, numbers, and symbols. However, a
    compliant J6 interpreter MUST run programs containing
    any and all Unicode characters.

PHRASE SYNTAX

    A value literal in J6 is one of the following:

    - A single quote (') followed by any sequence of non-
      whitespace characters.
    - A double quote (") followed by any sequence of
      characters in which double-quote literals are escaped
      by repetition (""), and finally by a double quote
      that signifies the end of the literal.
    - A digit 1-9 followed by any number of digits.

    Whatever their syntax, value literals must be set off
    from surrounding text by space characters (ASCII 32).
    If they are not, the behavior is unspecified.

WHITESPACE

    Outside value literals, extra spaces are not
    significant. One space character is the same as two or
    more spaces.

    Newlines outside literals are significant because they
    separate commands from one another.

CONDITIONALS

    Conditionals look like this:

      CHK  $MYVAR = "SOME VALUE"
      SET  !DISP[1] "GOT EXPECTED VALUE"
      CATCH
      CHK  $MYVAR <> "SOME VALUE"
      SET  !DISP[1] "GOT "
      APPD !DISP[1] MYVAR
      APPD !DISP[1] " INSTEAD"
      CATCH

    The CHK command does a boolean test, using its second
    argument as a comparator. If the condition is true, the
    following commands are executed. If the condition is
    false, the following commands are skipped over until a
    CATCH command is reached, at which point normal
    execution resumes. The CATCH itself is a no-op.

    Note that there is no "nesting" of conditionals, and
    a CHK command can't really be said to "match" with a
    particular CATCH. E.g. the following code:

      CHK  FOO 1
      CHK  BAR 2
      SET  'LINE[1] "FOO IS 1 AND BAR IS 2"
      CATCH
      SET 'LINE[2] "THIS WILL ALWAYS BE PRINTED"
      CATCH

    The second CATCH does nothing. If either FOO is not 1 or
    BAR is not 2, execution jumps to the first CATCH.

    To construct complex boolean operations, it is necessary
    to combine CHK commands:

      ---- BOOLEAN AND EXAMPLE
      CHK  $MONEY >= 5
      CHK  $AGE >= 21
      SET  CAN_BUY_DRINK YES
      CATCH

      ---- BOOLEAN OR EXAMPLE
      CHK  $PULSE = 0
      SET  DEAD YES
      CATCH
      CHK  $NUMBER_OF_HEADS < 1
      SET  DEAD YES
      CATCH

    These approaches can, of course, be trivially combined
    to construct sums of products, so any boolean function
    can be formed.

COMMANDS

VAR <var>

    VAR declares a variable for usage in the current stack
    frame. VAR may be used at any time, not necessarily just
    after the stack frame has been pushed.

    Referencing a variable without first declaring it with
    VAR is an error that will crash the program.

    If a variable is declared with VAR but not SET or
    otherwise modified, attempts to read it will yield the
    empty value "".

DEL <var>

    DEL deletes a variable from the current stack frame,
    freeing its associated memory. Future attempts to access
    the variable will behave as if the variable had never
    been set. That is, if the variable is set on a higher
    stack frame, the value of that variable will be
    retrieved. Otherwise, accessing the variable results in
    a crash.

SET <var> <value>

    Sets <var> to the given value.

INCR <var> <amount>

    INCR increments a variable by a given amount.

DECR <var> <amount>

    Decrements a variable.

MULT <var> <factor>

DIV  <var> <divisor>

APPD <var> <text>

    Appends the given value to the end of the current value
    of <var>.

SHFT <dest> <src>

    Removes the first character from the value in variable 
    <src> and puts it in

MARK <phrase>
JUMP <phrase>
LAND

    MARK creates a mark--an association between the given
    phrase and the current location in the program.
    Subsequent (in time) commands of the form JUMP <phrase>
    will jump to the first LAND command following the MARK.

    When a mark is made, it is stored in the current stack
    frame. A POP command can thus remove marks. Marks on
    the current stack frame can hide (but do not overwrite)
    marks on higher stack frames.

    If you try to JUMP to a MARK that hasn't yet been set,
    the program crashes.

    LAND is a no-op. It just controls where to start
    executing commands after a JUMP.

    By using PUSH, POP, MARK, JUMP, and LAND, it is possible
    to emulate function calling.

PUSH

    Pushes a new stack frame. Subsequent (in time) calls to
    VAR will create variables in this stack frame. Also,
    subsequent calls to MARK will create marks in this stack
    frame.

    Variables from higher stack frames are still readable
    and writable as long as no VAR declaration in this
    stack frame hides them. Also, marks from higher stack
    frames can still be JUMPed to as long as no mark in
    the current stack frame hides them.

POP

    Destroys the most recently PUSHed stack frame.

CHK <val1> <op> <val2>
CATCH

    CHK compares two values using <op>, which must be one of
    "=", "<", ">", "<=", ">=", or "<>". Any other value of
    <op> will crash the program.

    If both values are numeric, they will be converted to
    integers before comparison. Otherwise, the values are
    compared lexicographically.

    If the comparison holds true, CHK does nothing. If it is
    false, program execution skips downward until it reaches
    a CATCH command, at which point the normal flow resumes.

COMMENTS

    A dash/hyphen/minus (-) at the beginning of a line
    signifies that that line is a comment. It will be
    ignored by the computer.

    Style dictates that you begin your comments with four
    hyphens followed by a space, so the text of the comment
    lines up with the rest of the program content and the
    comment is clearly visible, but this is not required.
