
class Node {
    char value;
    Node left, right;
    Node(char value){
        this.value = value;
        left = null;
        right = null;
    }
    int evaluate(){
        if (value <= '9' && value >= '0')
            return value - '0';
        else{
            int leftValue = left.evaluate();
            int rightValue = right.evaluate();
            return switch (value) {
                case '+' -> leftValue + rightValue;
                case '-' -> leftValue - rightValue;
                case '*' -> leftValue * rightValue;
                case '/' -> leftValue / rightValue;
                default -> 0; 
            };
        }
    }
}

class Tree {
    Node root;
    Tree(String s){
        if (s.length() == 1)
            root = s.charAt(0);
        else {
            boolean l = true;in
            char[] array = s.toCharArray();
            for (char c: array){
                if (c == ' ')
                    continue;
                else if (c >= '0' && c <= '9'){
                    if (l)
                }
            }
        }
    }
}



public class main {
    public static void main(String[] args) {
    }
}