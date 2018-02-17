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

VALUES

    All data manipulated by J6 programs are represented as
    VALUES. A value is a sequence of letters, numbers, or
    symbols (collectively called CHARACTERS) that may be
    of any length >= 0. In J6 code, numeric values are
    represented by decimal numbers:

      TAKE 10

    This loads the value 10 into register memory.

    Numeric values may also have a decimal point:

      TAKE 101.33333

    When performing calculations on numbers, the result
    is rounded to the precision of the most precise operand.
    A calculation like

      TAKE 10
      DIV  3
      PUT  RESULT

    Would divide 10 by 3 yielding 3, which would then be
    put into the result. To get more precision, we can
    add decimal places to one or both of the operands:

      TAKE 10.00
      DIV  3
      PUT  RESULT

    This stores the value 3.33 into the variable RESULT.

    Rounding is done the way you learned in elementary
    school: 0.5 and higher round up to 1; lower values
    round down to 0.

    J6 programs can also manipulate textual values. Such
    non-numeric values must of course be distinguished from
    program code in some way; this is done by surrounding
    them with asterisks:

      TAKE *HELLO, WORLD*

    The asterisks are not part of the value's data: this
    command loads the characters H E L L O <comma> <space> W
    O R L D into the
    register. The asterisks merely indicate that the
    characters between them represent a value. The command
    below would read the value of the variable named HELLO
    into the register:

      TAKE HELLO

    The empty value is represented, as you might expect,
    by two asterisks:

      TAKE **

    If a textual value is a single character, it may also be
    represented by preceding it with an equals sign (=):

      TAKE =*

    This loads the single character * into the register--
    something that would not be possible without this
    syntax!

THE REGISTER

    The J6 execution environment has a REGISTER, a special
    storage area for "working memory" values. Most J6
    commands manipulate the register in some way, either
    by storing a value in it, transforming the value, or
    reading a value out.

VARIABLES

    Values to be manipulated by the program are often stored
    in VARIABLES. A variable is nothing more than a named
    container for a single value.

    To reference a variable in a command, simply use its
    name:

      TAKE X

    This loads the value of variable X into register memory.
    It is possible that when this command executes, no
    command has yet specified what the value of X is; in
    that case, the program crashes.

EXPRESSIONS

    An expression is a combination of variables and/or
    literal values that is EVALUATED to a particular value
    when the program runs.

    In an expression, the names of variables may be
    constructed from the values of other variables. For
    example, suppose we have variables X1, X2, X3, ... X10
    and we want to know their sum. The following code
    does the computation:

      TAKE 0
      EACH N 1 10
      ADD  X[N]
      PUT  SUM

    Values may also be concatenated within expressions.
    Here is an example:

      SET  NAME *WORLD*
      TAKE *HELLO, *NAME*!*
      PRINT

    This prints HELLO, WORLD!. In order for this
    to work, there must be no spaces between the value
    literals and the variable NAME (space-separated values
    would be interpreted as separate arguments to TAKE).

    Expressions can also slice particular characters out
    of a variable's value, by specifying their location.
    The following command loads the first two characters of
    the value of X into the register:

      TAKE X:1-2

    This can be combined with variable construction:

      TAKE X:[START]-[END]

    Assuming START and END have positive integer values,
    this command will load the corresponding range of X into
    the register.

TESTS

    J6 programs are usually distributed with TESTS: code
    that demonstrates some degree of correctness of various
    subroutines.

    Test syntax is similar to subroutine syntax, though
    one cannot call a test.

      TEST *SUM LIST*
      SET  X1 2
      SET  X2 4
      SET  X3 5
      CALL SUM =X 1 3
      ASRT SUM = 11
      PASS

    The J6 environment executes the test top-down, exactly
    like a subroutine. Tests may of course call subroutines
    (that's the whole point). Tests generally make use of
    the ASRT command.

    If executing the test reaches the PASS command, the test
    ends (much like RETURN for subroutines) and is deemed
    successful. If any ASRTs fail, of course, the PASS
    command is not reached and the test is considered to
    have failed.

    J6 environments typically execute all tests before
    invoking the actual program, and will cancel the
    execution of the program if any tests fail. Tests are
    thus a safeguard that can prevent bad code from ever
    running. Writing thorough tests can thus save much
    debugging time.

    Another type of test, denoted by the command CRASHTEST,
    is used to test the conditions under which a subroutine
    will crash. This can be useful, for example, to check
    whether a subroutine's own assertions are guarding
    effectively against bad input.

      CRASHTEST *SUM WITH NONEXISTENT VARIABLE*
      CALL SUM =X 1 1
      FAIL

    If a CRASHTEST reaches the FAIL command, it fails; if
    an assertion causes the test to crash before the FAIL
    happens, it is deemed to have passed.

    If a TEST or CRASHTEST fails (or crashes), other tests
    will still run. Each test actually gets its own
    execution environment, with its own variables,
    registers, and call stack; tests cannot interfere with
    each other in any way.

COMMANDS

    J6 programs are built from SUBROUTINES comprising
    COMMANDS that execute
    one at a time, and generally in top-down sequence. A few
    commands can cause other commands to be skipped or
    repeated. The CALL command passes control to
    another subroutine.

    A command consists of a short word, called the VERB,
    followed by zero or more ARGUMENTS. Each verb requires
    a specific number of arguments to follow it. Using any
    other number of arguments is an error that will cause
    the program not to run.

    For example, the TAKE command puts the value of a
    variable in the register. The ADD command adds a
    number to the value in the register.

    Here is a subroutine that computes the Nth triangular
    number.

      SUB  TRIANGLE 20
      ASRT N > 0
      TAKE 0
      EACH I 1 N
      ADD  I
      PUT  TRIANGLE
      RETURN

    The verb must be separated from its arguments, and the
    arguments from one another, by one or more spaces.
    The number of spaces is not
    significant.

SUBROUTINES

    The organization of programs into SUBROUTINES greatly
    eases the mental burden on the programmer. Rather than
    having to think through the fiddly details of common
    operations each time they are repeated, the programmer
    can use a subroutine that does the desired work.

    The beginning of a subroutine is marked by the SUB
    command:

      SUB  MAIN 1
      PRNT *HELLO, WORLD!*
      RETURN

    Subroutines have a NAME and a RANK, the latter denoted
    by a positive integer. Subroutines may
    only be called from those with a smaller rank
    number. This prevents low-level operations, like
    summing a list of numbers, from invoking executive
    routines like MAIN or a routine that takes input from
    the user. This strict hierarchy makes programs much
    easier to understand. For instance, when a programmer
    is trying to figure out what other parts of the program
    might directly or indirectly call a subroutine she is
    about to modify, she can simply print out all
    subroutines with smaller ranks than the one in
    question.

    If the rank number is left off of a subroutine
    declaration, its rank is deemed to be infinite--that
    is, larger than all ranks that are specified with a
    number. This means that subroutines without a rank
    number may not call any other subroutines, but they
    may be called from anywhere.

    Typically, programmers will number their ranks in
    increments of 10: the MAIN routine has rank 1, and
    subsequent ranks are 10, 20, 30, etc. This gives
    some room to insert ranks in between existing ones
    if that is required. If the ranks become too
    compacted and there is no room to add more in-betweens,
    the programmer can run a tool that decompacts the
    ranks of a program so they are once again multiples of
    10.

    Subroutines are always terminated by a RETURN command.
    This returns control to the caller of the subroutine,
    at the command following the CALL. A subroutine may
    incorporate multiple RETURNs if some only happen
    conditionally:

      SUB  SAFE_DIVIDE
      IF   B = 0
      RETURN
      TAKE A
      DIV  B
      PUT  SAFE_DIVIDE
      RETURN

    Once a subroutine PUTs or SETs a variable, it OWNS that
    variable. When it returns, it gives up the ownership
    of the variable. A subroutine cannot modify a variable
    that is owned by another subroutine, unless the owner
    explicitly allows it by listing it after the subroutine
    name in the CALL command. This transfers ownership of
    the variable to the subroutine.

      SUB  MAIN 1
      SET  X **
      CALL GET_USER_INPUT X
      PRNT X
      RETURN

    Here, GET_USER_INPUT is allowed to set the variable X
    because of the CALL command. It is also allowed to
    give the variable to subroutines that it calls. A
    subroutine cannot give a variable it does not own to
    another subroutine.

    It is possible for a variable to be unowned by any
    subroutine. For instance, in the following program,
    X is unowned immediately after SET_X returns (but then
    becomes owned by MAIN once MAIN uses SET).

      SUB  MAIN 1
      CALL SET_X
      SET  X 2
      RETURN

      SUB  SET_X
      SET  X 1
      RETURN

    When a variable is unowned, any subroutine may PUT or
    SET it, thereby taking ownership of it.

INPUT AND OUTPUT

    J6 programs have several types of input and output
    available to them:

    - File storage
    - A symbol grid on which the user can select and
      unselect elements using a pointing device.
    - Textual inputs where the user can type things
    - A line printer
    - Buttons (4 directional buttons, A and B)
    - The Internet

    With the exception of button presses and printing,
    all forms of IO are conducted by binding variable values
    to IO devices.

      FILE MYFILE */path/to/file*
      GRID MYGRID 20 20
      TEXT FOO 1
      HTTP WEBPAGE *http://example.com*

    After these statements execute, the variables MYFILE,
    WEBPAGE, and FOO will be bound to IO devices. Their
    values will always be equal to the content of the
    device, and setting the value will update the device.

    A WAIT command pauses execution of the program until
    the user presses a button. Once a button is pressed,
    the special system variable $BUTTON is set to tell the
    program which button it was. Execution then resumes.

    WAIT takes optional arguments that tell it which buttons
    to wait for; other button presses are ignored.

      SUB  ASK_A_OR_B
      ASRT DEFINED A
      ASRT DEFINED B
      PRNT *CHOOSE A (*A*) OR B (*B*)*
      WAIT =A =B
      SET  ASK_A_OR_B [$BUTTON]
      RETURN

COMMENTS

    A dash/hyphen/minus (-) at the beginning of a line
    signifies that that line is a comment. It will be
    ignored by the computer.

    Style dictates that you begin your comments with four
    hyphens followed by a space, so the text of the comment
    lines up with the rest of the program content and the
    comment is clearly visible, but this is not required.

      ---- HELLO WORLD
      ---- A PROGRAM BY BEN CHRISTEL
      SUB  MAIN 1
      PRNT *HELLO, WORLD*
      RETURN

DEBUGGING

    J6 programs inevitably have bugs, but fixing the bugs
    is usually easy. The J6 environment records every input
    made by the user, so the programmer can replay a program
    step by step after observing the bug to find out what
    went wrong. Since all variables are global and only
    contain textual values, it is very easy to display them
    in a debugger window. The environment can even keep
    track of which line of code most recently set each
    variable.
